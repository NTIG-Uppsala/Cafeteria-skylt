import os
import platform
from http.server import HTTPServer, SimpleHTTPRequestHandler
from os import getcwd, path

if platform.system() == "Windows":
    cwd = getcwd()
    os.chdir(cwd + "/public")
elif platform.system() == "Linux":
    os.chdir("/home/pi/Git/cafeteria-display/public")
serverAddress = ("", 8000)
httpd = HTTPServer(serverAddress, SimpleHTTPRequestHandler)
print("\nThe server is open at http://127.0.0.1:8000")
httpd.serve_forever()