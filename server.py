from http.server import BaseHTTPRequestHandler, HTTPServer
import mimetypes
from modules.getfiles import get_dir_files_data

class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)

        if self.path == '/files':
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            message = get_dir_files_data()
            print(message.replace('\n', '\\n')[:150]+'...')

            self.wfile.write(bytes(message, "utf8"))
        else:
            file_path = 'index.html'
            if self.path and self.path != '/':
                file_path = './'+self.path

            mimetype = mimetypes.MimeTypes().guess_type(file_path)[0]
            self.send_header('Content-type', mimetype)
            self.end_headers()

            self.wfile.write(open(file_path, 'rb').read())

def run():
  print('starting server...')
  server_address = ('127.0.0.1', 80)
  httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
  print('running server...')
  httpd.serve_forever()

run()