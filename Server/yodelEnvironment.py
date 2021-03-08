from json.decoder import JSONDecodeError
import threading
from types import LambdaType
from typing import NoReturn, Dict
from websockets.exceptions import WebSocketException
from websockets.server import WebSocketServer
import yodel
import globals
from time import sleep
import websockets
import asyncio
import json


def passYodelSend(data): yodel.send(data["payload"], name=data["name"], group=data["group"])
def passYodelAddGroup(data) : yodel.addGroup(data["group"])
def passYodelSetName(data) : yodel.setName(data["name"])

yodelResponses = {
    "send" : passYodelSend,
    "addGroup" : passYodelAddGroup,
    "setName"  : passYodelSetName
}


async def yodelLoop(outsock:websockets.server.WebSocketServerProtocol) -> NoReturn:

    raw:yodel.Section = yodel.listen()
    if raw is not None:
        raw = yodel.autoDecode(raw)
        if not isinstance(raw, bytes): raw = raw.fields 
        else: raw = {"string":raw.decode()}
        print(raw)
        await outsock.send(json.dumps(
            {
                "action":"incoming",
                "kwargs":raw
            }
        ))

async def checkIncomingJSON(sock:websockets.server.WebSocketServerProtocol) -> NoReturn:
    
    try:
        jsonRequest = await asyncio.shield(asyncio.wait_for(sock.recv(), 0.01) )
    except:
        return None
    
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



async def yodelSuite(sock:websockets.server.WebSocketServerProtocol, path):
    while True:
        await checkIncomingJSON(sock)
        await yodelLoop(sock)



def beginServing():
    print("Binding to port: ", globals.port)
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(yodelSuite, "localhost", globals.port)
    )
    yodel.startRadio(globals.yodelStartRadio)
    asyncio.get_event_loop().run_forever()