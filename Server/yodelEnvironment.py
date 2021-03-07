from types import LambdaType
from typing import NoReturn, Dict
from websockets.server import WebSocketServer
import yodel
import globals
from time import sleep
import websockets
import asyncio
import json


passYodelSend = lambda data : yodel.send(data["payload"], name=data["name"], group=data["group"])
passYodelAddGroup = lambda data : yodel.addGroup(data["group"])


yodelResponses = {
    "send" : passYodelSend,
    "addGroup" : passYodelAddGroup
}


async def yodelLoop(outsock:websockets.server.WebSocketServerProtocol) -> NoReturn:
    sleep(0.1)
    raw:yodel.section = yodel.listen()


async def checkIncomingJSON(sock:websockets.server.WebSocketServerProtocol) -> NoReturn:
    
    jsonRequest = await sock.recv()
    try:
        jsonRequest = json.loads(jsonRequest)
    except json.JSONDecodeError as e:
        print(str(e))
    action = jsonRequest["action"]
    kwargs = jsonRequest["kwargs"]
    print(jsonRequest)
    if ('channel' in kwargs):
        yodel.setChannel(int(kwargs["channel"]))

    yodelResponses[action](kwargs)



async def yodelSuite(sock, path):
    await asyncio.gather(
        yodelLoop(sock),
        checkIncomingJSON(sock)
    )

def beginServing():
    print("Binding to port: ", globals.port)
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(yodelSuite, "localhost", globals.port)
    )
    asyncio.get_event_loop().run_forever()