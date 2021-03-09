from json.decoder import JSONDecodeError
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
from threading import Thread


existingYodelFormats = []
apiEnumToPyType = {
    0: int,
    1: str,
    2: bytearray,
    3: yodel.Flags
}

def passYodelSendBasic(data): 
    yodel.send(data["payload"], name=data["name"], group=data["group"])
def passYodelSendSection(data):
    
    sectionData = data["payload"]
    print("SECTION DATA:")
    print(sectionData)
    section = yodel.Section(passYodelNewFormat(sectionData["format"]))
    for key in sectionData["fields"]:
        section[key]=sectionData["fields"][key]
    
    section.payload = (sectionData["payload"]).encode()
    section.print()
    yodel.send(section,name=data["name"], group=data["group"])


def passYodelAddGroup(data) : yodel.addGroup(data["group"])
def passYodelSetName(data) : yodel.setName(data["name"])
def passYodelNewField(data) -> yodel.Field : return yodel.Field(data["name"], apiEnumToPyType[data["type"]], data["args"], min=int(data["min"]), max=int(data["max"]), bytes=int(data["bytes"]))
def passYodelNewFormat(data) -> yodel.Format: 
    if data["mtype"] in existingYodelFormats:
        return yodel.globaldat.messages_types[data["mtype"]]
    existingYodelFormats.append(data["mtype"])
    return yodel.Format(
        [
        passYodelNewField(field) for field in data["fields"]
        ], mtype=data["mtype"])
     
yodelResponses = {
    "sendBasic" : passYodelSendBasic,
    "sendSection": passYodelSendSection,
    "addGroup" : passYodelAddGroup,
    "setName"  : passYodelSetName,
    "createFormat" : passYodelNewFormat 
}


async def yodelLoop(outsock:websockets.server.WebSocketServerProtocol) -> NoReturn:
    while True:
        raw:yodel.Section = yodel.listen()
        if raw is not None:
            raw = yodel.autoDecode(raw)
            
            if not isinstance(raw, bytes): 
                raw = {"fields":raw.fields, "mtype":raw.format.mtype, "payload":raw.payload.decode()} 
            else: 
                raw = {"string":raw.decode()}
            print(raw)
            await outsock.send(json.dumps(
                {
                    "action":"incoming",
                    "kwargs":raw
                }
            ))

async def checkIncomingJSON(sock:websockets.server.WebSocketServerProtocol) -> NoReturn:
    
    #try:
    #    jsonRequest = await asyncio.shield(asyncio.wait_for(sock.recv(), 0.10) )
    #except:
    #    return None
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

def manageJSON(sock):
    ownloop = asyncio.new_event_loop()
    while True:
        asyncio.get_event_loop().run_until_complete( checkIncomingJSON(sock) )

async def yodelSuite(sock:websockets.server.WebSocketServerProtocol, path):
    t = Thread(target=manageJSON, args=(sock,))
    t.start()
    await yodelLoop(sock)
    t.join()


def beginServing():
    print("Binding to port: ", globals.port)
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(yodelSuite, "localhost", globals.port)
    )
    yodel.startRadio(globals.yodelStartRadio)
    asyncio.get_event_loop().run_forever()