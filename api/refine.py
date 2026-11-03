"""Proofline AI refinement – a Vercel Python function (standard library only).

GET  /api/refine  -> {"configured": bool, "model": str, "reason": str}
POST /api/refine  -> {"text": str}   body: {"target": {...}, "facts": "..."}

The browser removes names, numbers, emails, usernames and links before calling this.
This function never logs or stores what it receives.
"""

from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

DEFAULT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"
MAX_FACTS = 12_000
MAX_FIELD = 600
TIMEOUT = 55  # stay under the function's time limit

SYSTEM_PROMPT = """You help survivors of AI-facilitated, technology-facilitated violence (deepfakes, cloned voices, sextortion, impersonation, harassment, doxing) write clear reports to online platforms and police.

Rules:
- Write in {language}, in the first person, as the person making the report.
- Use ONLY the facts provided. Never invent facts, dates, names, numbers, links, evidence or events. If something is missing, leave it out; do not add blanks like [date].
- Text in square brackets such as [NAME_1], [URL_2], [PHONE_1], [EMAIL_1], [HANDLE_1] stands for hidden personal details. Copy every one of them exactly as written, wherever it belongs.
- Be calm, factual and specific. No exaggeration, no legal threats, no graphic or sexual description.
- If the facts say the content is AI-generated or manipulated, say so near the start.
- Name the platform rule or category given, describe the harm concretely, and end with a clear request (removal and preventing re-upload, or investigation for police).
- Keep links as a list, one per line.
- Respect any character limit given.
- Output only the report text. No preamble, no notes, no markdown headings."""

_THINK = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


def config() -> tuple[str, str, str]:
    """Return (api_key, model, reason_if_unconfigured)."""
    key = (os.environ.get("OPENROUTER_API_KEY") or "").strip().strip('"').strip("'")
    model = (os.environ.get("PROOFLINE_MODEL") or DEFAULT_MODEL).strip().strip('"').strip("'")
    if not key:
        return "", model, (
            "No OPENROUTER_API_KEY is set. On Vercel: Project > Settings > Environment Variables, add OPENROUTER_API_KEY, "
            "then redeploy. Locally: put OPENROUTER_API_KEY=sk-or-v1-... in a file named .env next to dev_server.py."
        )
    return key, model, ""


LANGUAGES = {"en": "English", "ar": "Modern Standard Arabic"}


def system_prompt(lang: str) -> str:
    return SYSTEM_PROMPT.replace("{language}", LANGUAGES.get(lang, "English"))


def build_user_prompt(target: dict, facts: str) -> str:
    def clip(v) -> str:
        return str(v or "")[:MAX_FIELD]

    parts = [
        f"Report destination: {clip(target.get('name'))}",
        f"Category to cite: {clip(target.get('category'))}",
        f"Relevant rule: {clip(target.get('policy'))}",
    ]
    limit = target.get("limit")
    if isinstance(limit, int) and 0 < limit < 100_000:
        parts.append(f"Character limit: {limit} characters maximum (count carefully).")
    parts += ["", "Facts from the person reporting:", facts]
    return "\n".join(parts)


def call_openrouter(api_key: str, model: str, target: dict, facts: str, url: str | None = None, lang: str = "en") -> str:
    url = url or os.environ.get("PROOFLINE_OPENROUTER_URL") or "https://openrouter.ai/api/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt(lang)},
            {"role": "user", "content": build_user_prompt(target, facts)},
        ],
        "temperature": 0.3,
        "max_tokens": 1500,
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "X-Title": "Proofline"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = json.loads(e.read().decode("utf-8")).get("error", {}).get("message", "")
        except Exception:
            pass
        if e.code == 401:
            raise RefineError(502, "The OpenRouter API key was rejected. Check OPENROUTER_API_KEY.")
        if e.code == 429:
            raise RefineError(429, "The free AI model is busy or rate-limited. Wait a minute and try again, or use the template.")
        raise RefineError(502, f"AI service error {e.code}. {detail}".strip())
    except (urllib.error.URLError, TimeoutError) as e:
        raise RefineError(504, "The AI service didn't respond in time. Try again, or use the template.") from e

    try:
        content = data["choices"][0]["message"].get("content") or ""
    except (KeyError, IndexError, TypeError):
        raise RefineError(502, "Unexpected response from the AI service.")
    content = _THINK.sub("", content).strip()
    if not content:
        raise RefineError(502, "The AI returned an empty answer. Try again, or use the template.")
    return content


class RefineError(Exception):
    def __init__(self, status: int, message: str):
        super().__init__(message)
        self.status = status
        self.message = message


class handler(BaseHTTPRequestHandler):
    def _send(self, status: int, body: dict) -> None:
        raw = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def log_message(self, *args) -> None:  # never log requests
        return

    def _same_origin(self) -> bool:
        origin = self.headers.get("Origin")
        if not origin:
            return True  # same-origin GETs and non-browser tools send no Origin
        host = (self.headers.get("X-Forwarded-Host") or self.headers.get("Host") or "").split(",")[0].strip()
        return urlparse(origin).netloc == host

    def do_GET(self) -> None:
        key, model, reason = config()
        self._send(200, {"configured": bool(key), "model": model, "reason": reason})

    def do_POST(self) -> None:
        if not self._same_origin():
            self._send(403, {"error": "Requests from other websites are not allowed."})
            return
        key, model, reason = config()
        if not key:
            self._send(503, {"error": "The AI option isn't set up on this site.", "reason": reason})
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > 64_000:
            self._send(413, {"error": "The report is too long to send. Shorten it, or use the template."})
            return
        try:
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            target = body.get("target") or {}
            facts = str(body.get("facts") or "")
            lang = body.get("lang") if body.get("lang") in LANGUAGES else "en"
            if not isinstance(target, dict):
                raise ValueError
        except (ValueError, UnicodeDecodeError):
            self._send(400, {"error": "Invalid request."})
            return
        if not facts.strip():
            self._send(400, {"error": "Fill in at least one box first."})
            return
        if len(facts) > MAX_FACTS:
            self._send(413, {"error": "The report is too long to send. Shorten it, or use the template."})
            return
        try:
            text = call_openrouter(key, model, target, facts, lang=lang)
        except RefineError as e:
            self._send(e.status, {"error": e.message})
            return
        self._send(200, {"text": text})
