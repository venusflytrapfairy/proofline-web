"""Run Proofline on your own computer, exactly as it will run on Vercel.

    python dev_server.py

Then open http://localhost:3000

- Serves the website from the public/ folder.
- Runs the AI function from api/refine.py at /api/refine.
- Reads your OpenRouter key from a file named .env in this folder:
      OPENROUTER_API_KEY=sk-or-v1-your-key
- Applies the same security headers as vercel.json.
Uses only Python's standard library: nothing to install.
"""

from __future__ import annotations

import importlib.util
import json
import mimetypes
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public"
PORT = int(os.environ.get("PORT", "3000"))

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("image/svg+xml", ".svg")


def load_env(path: Path) -> list[str]:
    """Load KEY=value lines from .env. Quotes around values are optional. Returns problems found."""
    problems = []
    if not path.exists():
        alt = [p.name for p in ROOT.iterdir() if p.name.startswith(".env") or p.name in ("env", "env.txt")]
        if alt:
            problems.append(f"Found {', '.join(alt)} but not a file named exactly .env")
        return problems
    for n, raw in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            problems.append(f".env line {n} has no '=' sign")
            continue
        k, v = line.split("=", 1)
        v = v.strip().strip('"').strip("'").strip("“”")
        os.environ.setdefault(k.strip(), v)
    return problems


def load_refine():
    spec = importlib.util.spec_from_file_location("refine", ROOT / "api" / "refine.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def vercel_headers() -> list[tuple[str, str]]:
    cfg = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    for block in cfg.get("headers", []):
        if block.get("source") == "/(.*)":
            return [(h["key"], h["value"]) for h in block["headers"]]
    return []


refine = load_refine()
HEADERS = vercel_headers()


class DevHandler(refine.handler, SimpleHTTPRequestHandler):
    # Fixed types: on Windows the registry can wrongly map .js to text/plain, which breaks the app.
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".wasm": "application/wasm",
        ".traineddata": "application/octet-stream",
    }

    def end_headers(self):
        for k, v in HEADERS:
            self.send_header(k, v)
        super().end_headers()

    def do_GET(self):
        if self.path.split("?")[0].rstrip("/") == "/api/refine":
            return refine.handler.do_GET(self)
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path.split("?")[0].rstrip("/") == "/api/refine":
            return refine.handler.do_POST(self)
        self.send_error(404)


def main():
    problems = load_env(ROOT / ".env")
    key, model, reason = refine.config()
    print("\nProofline is running at  http://localhost:%d\n" % PORT)
    if key:
        print(f"  AI option: ON  (model {model}, key ending ...{key[-4:]})")
    else:
        print("  AI option: OFF")
        for p in problems:
            print(f"    - {p}")
        print(f"    - {reason}")
    print("\n  Press Ctrl+C to stop.\n")
    server = ThreadingHTTPServer(("127.0.0.1", PORT), partial(DevHandler, directory=str(PUBLIC)))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        sys.exit(0)


if __name__ == "__main__":
    main()
