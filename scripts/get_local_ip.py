"""Prints this machine's LAN IP. Used by start.bat to avoid hardcoding an IP."""
import socket

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(('8.8.8.8', 80))
    print(s.getsockname()[0])
    s.close()
except OSError:
    print('127.0.0.1')
