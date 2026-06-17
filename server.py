#!/usr/bin/env python3
import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

LINEUP = os.path.join(os.path.dirname(__file__), "lineup.json")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
}


class Handler(SimpleHTTPRequestHandler):
    def send_cors(self):
        for k, v in CORS.items():
            self.send_header(k, v)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors()
        self.end_headers()

    def do_POST(self):
        if self.path != "/lineup.json":
            self.send_response(404)
            self.send_cors()
            self.end_headers()
            return
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            data = json.loads(body)
        except json.JSONDecodeError as e:
            self.send_response(400)
            self.send_cors()
            self.end_headers()
            self.wfile.write(f'{{"error":"{e}"}}'.encode())
            return
        with open(LINEUP, "w") as f:
            json.dump(data, f, indent=2)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_cors()
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} {fmt % args}")


if __name__ == "__main__":
    port = 9100
    server = HTTPServer(("", port), Handler)
    print(f"Serving at http://localhost:{port}")
    print(f"Lineup file: {LINEUP}")
    server.serve_forever()
