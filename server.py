import http.server
import socketserver
import json
import os
from datetime import datetime

PORT = 8000
DIRECTORY = "."

class RestaurantHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/contact':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Setup a directory logic for storing data
                os.makedirs('data', exist_ok=True)
                
                record = {
                    "timestamp": datetime.now().isoformat(),
                    "name": data.get("name"),
                    "email": data.get("email"),
                    "type": data.get("type"),
                    "message": data.get("message")
                }
                
                # Append to messages.json
                messages_file = 'data/messages.json'
                messages = []
                if os.path.exists(messages_file):
                    with open(messages_file, 'r') as f:
                        try:
                            messages = json.load(f)
                        except json.JSONDecodeError:
                            pass
                            
                messages.append(record)
                
                with open(messages_file, 'w') as f:
                    json.dump(messages, f, indent=4)
                    
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {"status": "success", "message": "Message received"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {"status": "error", "message": str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), RestaurantHandler) as httpd:
        print(f"Serving backend on port {PORT}...")
        print(f"URL: http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
