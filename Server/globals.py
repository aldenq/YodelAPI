from typing import *
from queue import Queue
import websockets
from websockets.server import WebSocketServer

yodelStartRadio: str = ""
port:int = 5560
incomingTaskList:Queue = Queue(1024)
