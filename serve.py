#!/usr/bin/env python3
"""Serve a saved single-page site the way the real one behaves: any path without a file extension
(/people, /brand ...) gets index.html and the app's router does the rest.
Usage: python serve.py [folder] [port]      (defaults: site 8080)"""
import http.server, os, socketserver, sys

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else "site")
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def do_GET(self):
        if not os.path.splitext(self.path.split("?")[0].split("#")[0])[1]:
            self.path = "/index.html"
        return super().do_GET()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as srv:
    print(f"Serving {ROOT}\n  -> http://localhost:{PORT}   (Ctrl+C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
