from typing import *
from queue import Queue

# Yodel radio device name
yodelStartRadio: str = ""
# WebSocket port number
port:int = 5560
# Global Queue for cross-thread communication
outgoingMessages:Queue = Queue(1024)
