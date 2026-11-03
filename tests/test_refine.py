"""Tests for the AI function. Run with:  python -m pytest -q tests"""

import importlib.util
import json
import threading
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("refine", ROOT / "api" / "refine.py")
refine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refine)

RECEIVED = {}


class FakeOpenRouter(BaseHTTPRequestHandler):
    def do_POST(self):
        RECEIVED["body"] = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        RECEIVED["auth"] = self.headers.get("Authorization")
        mode = RECEIVED.get("mode", "ok")
        if mode == "429":
            self.send_response(429)
            self.end_headers()
            self.wfile.write(b"{}")
            return
        text = "<think>hidden</think>Subject: Report\n\nI am [NAME_1]."
        out = json.dumps({"choices": [{"message": {"content": text}}]}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(out)

    def log_message(self, *a):
        pass


def _serve(handler_cls):
    srv = ThreadingHTTPServer(("127.0.0.1", 0), handler_cls)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def _post(url, body, origin=None):
    data = json.dumps(body).encode()
    headers = {"Content-Type": "application/json"}
    if origin:
        headers["Origin"] = origin
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


def test_end_to_end(monkeypatch):
    fake = _serve(FakeOpenRouter)
    monkeypatch.setenv("OPENROUTER_API_KEY", '"sk-or-v1-test"')  # quotes are tolerated
    monkeypatch.setenv("PROOFLINE_OPENROUTER_URL", f"http://127.0.0.1:{fake.server_port}/v1")
    app = _serve(refine.handler)
    base = f"http://127.0.0.1:{app.server_port}/api/refine"

    with urllib.request.urlopen(base) as r:
        info = json.loads(r.read())
    assert info["configured"] is True and info["model"] == refine.DEFAULT_MODEL

    target = {"name": "Police", "category": "x", "policy": "y", "limit": 1000}
    status, body = _post(base, {"target": target, "facts": "Name: [NAME_1]"})
    assert status == 200
    assert body["text"] == "Subject: Report\n\nI am [NAME_1]."  # <think> removed
    assert RECEIVED["auth"] == "Bearer sk-or-v1-test"
    assert RECEIVED["body"]["model"] == refine.DEFAULT_MODEL
    assert "Character limit: 1000" in RECEIVED["body"]["messages"][1]["content"]
    assert "Write in English" in RECEIVED["body"]["messages"][0]["content"]

    # Arabic reports
    status, _ = _post(base, {"target": target, "facts": "x", "lang": "ar"})
    assert status == 200 and "Write in Modern Standard Arabic" in RECEIVED["body"]["messages"][0]["content"]
    # unknown languages fall back to English
    _post(base, {"target": target, "facts": "x", "lang": "fr"})
    assert "Write in English" in RECEIVED["body"]["messages"][0]["content"]

    # other websites are refused
    status, _ = _post(base, {"target": target, "facts": "x"}, origin="https://evil.example")
    assert status == 403
    # same origin is fine
    status, _ = _post(base, {"target": target, "facts": "x"}, origin=f"http://127.0.0.1:{app.server_port}")
    assert status == 200
    # rate limit is explained
    RECEIVED["mode"] = "429"
    status, body = _post(base, {"target": target, "facts": "x"})
    assert status == 429 and "busy" in body["error"]
    RECEIVED["mode"] = "ok"
    # empty and oversized input
    assert _post(base, {"target": target, "facts": "  "})[0] == 400
    assert _post(base, {"target": target, "facts": "x" * 13000})[0] == 413


def test_not_configured(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    app = _serve(refine.handler)
    base = f"http://127.0.0.1:{app.server_port}/api/refine"
    with urllib.request.urlopen(base) as r:
        info = json.loads(r.read())
    assert info["configured"] is False and "Environment Variables" in info["reason"]
    status, body = _post(base, {"target": {}, "facts": "x"})
    assert status == 503
