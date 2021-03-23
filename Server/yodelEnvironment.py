#from yodel.errors import YodelError
from asyncio.exceptions import CancelledError
from json.decoder import JSONDecodeError
from types import FunctionType, LambdaType
from typing import Any, Callable, NoReturn, Dict
from websockets import exceptions
from websockets.exceptions import WebSocketException
from websockets.server import WebSocketServer
import yodel
import globals
from time import sleep
import websockets
import asyncio
import json
from threading import Thread
import sys
globalstdout = sys.stdout
def forceGuiPrint(*args):
    globalstdout.write(' '.join((str(arg) for arg in args)))
    globalstdout.flush()

'''
Existing yodel formats are cached Format obects created by the API
'''
existingYodelFormats = []
'''
The JavaScript API uses an enum (integer types) to depict python types,
so their association is layed out here.
'''
apiEnumToPyType = {
    0: int,
    1: str,
    2: bytearray,
    3: yodel.Flags
}

def insulatePassYodelCall(fn, data):
    try:
        fn(data)
    except YodelError as e:
        # Any yodel related errors are sent back up to the JS client to be thrown as JS errors
        forceGuiPrint(str(e))
        globals.outgoingMessages.put({"name":e.__name__,"message":str(e)})

'''
The following functions are designed to take in the 'kwargs' part of a JSON
request, and use them to make an yodel call with info from the call.
'''
def passYodelSendBasic(data): 
    '''The basic send function's kwargs are directly mapped'''
    if(globals.gui):
        forceGuiPrint(f"o{json.dumps(data)}")
    yodel.send(data["payload"], name=data["name"], group=data["group"])

def passYodelSendSection(data):
    '''
    The Section sending function's kwargs give information about creating a new section.
    E.X: {
        payload: "...",
        fields : {
            "key" : value,
            ...
        },
        format : {
            <format data, @see passYodelNewFormat>
        }
        group: "...",
        name: "..."
    }
    '''
    if(globals.gui):
        forceGuiPrint(f"o{json.dumps(data)}")
    sectionData = data["payload"]
    section = yodel.Section(passYodelNewFormat(sectionData["format"]))
    for key in sectionData["fields"]:
        section[key]=sectionData["fields"][key]


    section.payload = (sectionData["payload"]).encode()
    yodel.send(section,name=data["name"], group=data["group"])


def passYodeljoinGroup(data) : 
    '''Kwargs mapps directly to the call'''
    yodel.joinGroup(data["group"])

def passYodelSetName(data) : 
    '''Kwargs mapps directly to the call'''
    yodel.setName(data["name"])

def passYodelNewField(data) -> yodel.Field : 
    '''
    passYodelNewField creates a new field with the provided kwargs.
    Example input:
    {
        name: "...",
        type: 0-3,
        args: [...],
        min : 0->,
        max : 0->,
        bytes: 0->
    }
    '''
    return yodel.Field(
        data["name"], 
        apiEnumToPyType[int(data["type"])], 
        data["args"], 
        min=int(data["min"]), 
        max=int(data["max"]), 
        bytes=int(data["bytes"])
        )

def passYodelNewFormat(data) -> yodel.Format: 
    '''
    passYodelNewFormat takes info from kwargs and generates a new yodel.Format object.
    Simply calling the constructor is enough to feed the Format to the internal yodel
    functionality, but it is also cached in the API's scope through existingYodelFromats.

    Fields are generated using the passYodelNewField function.

    Example Input:
    {
        mtype: 1->,
        fields: [
            {
                <yodel.Field data, @see passYodelNewField>
            }
        ]
    }
    '''

    # if this format exists already:
    if data["mtype"] in existingYodelFormats:
        # return existing Format definition
        return yodel.globaldat.messages_types[data["mtype"]]
    # If this format does not exist yet:
    # add the 'mtype' type identifier to the cache list
    existingYodelFormats.append(data["mtype"])
    # Construct the yodel.Format by generating all the fields outlined in 'fields', 
    # and passing 'mtype':
    return yodel.Format(
        [
        passYodelNewField(field) for field in data["fields"]
        ], mtype=int(data["mtype"]))


def passYodelleaveGroup(data) -> NoReturn:
    yodel.leaveGroup(data["group"]) 

def passYodelToggleRelay(data) -> NoReturn:
    yodel.toggleRelay(bool(data["relay"]))

def passYodelSetChannel(data) -> NoReturn:
    yodel.setChannel(int(data["channel"]))

# yodelResponses contains all the callbacks for the API calls.
# So, when the JS sends over a request with {'action':'setName'}, the passYodelSetName function will be called
# as is seen below.
# The typehint here just means a dictionary with string keys, and API call functions
yodelResponses: Dict[str, Callable[[Dict[Any, Any]], Any]] = {
    "sendBasic" : passYodelSendBasic,
    "sendSection": passYodelSendSection,
    "joinGroup" : passYodeljoinGroup,
    "setName"  : passYodelSetName,
    "createFormat" : passYodelNewFormat,
    "leaveGroup" : passYodelleaveGroup,
    "toggleRelay" : passYodelToggleRelay,
    "setChannel" : passYodelSetChannel
}


def yodelLoop() -> NoReturn:
    '''
    The yodelLoop is responsible for listening to yodel connections in its own thread.
    '''
    while True:
        # Try wrapper for stability. Errors will still be printed for debugging.
        try:
            # check for incomming messages from the local yodel. (Non-blocking)
            raw:yodel.Section = yodel.listen()
            # if a message was found
            if raw is not None:
                # Use yodel's automatic decoding functionality to automaticall determine the fields etc... of the message
                raw = yodel.autoDecode(raw)
                
                # if the autoDecoded value is not bytes, it must be a Section object.
                if not isinstance(raw, bytes): 
                    raw = {"fields":raw.fields, "mtype":raw.format.mtype, "payload":raw.payload.decode()} 
                # otherwise, the autoDecoded value is a string, or maybe an integer. Either way, it is string encoded.
                else: 
                    raw = {"payload":raw.decode()}
                # the message sent back to the JS has action of 'incoming' to show that it is a new message
                # and the kwargs contain either the payload of a raw message, 
                # or the relevant section data of an encoded message.
                message = json.dumps(
                    {
                        "action":"incoming",
                        "kwargs":raw
                    }
                )
                if(globals.gui):
                    forceGuiPrint(f"i{json.dumps(raw)}")
                # The message (which is now just a string) can now be added to the global Queue 
                # where it will be picked up from the WebSocket thread, and sent to the JS.
                globals.outgoingMessages.put(message)
        
        except YodelError as e:
            # Any yodel related errors are sent back up to the JS client to be thrown as JS errors
            forceGuiPrint(str(e))
            globals.outgoingMessages.put({"name":e.__name__,"message":str(e)})

async def checkIncomingJSON(sock:websockets.server.WebSocketServerProtocol) -> NoReturn:
    '''
    checkIncomingJSON waits for a new command from the JS client, and then activates the appropriate
    yodelResponse.
    @see yodelResponses
    '''
    # This is the main blocking call that needs to be timed out.
    try:
        # check for incoming requests from JS, timeout after 0.1 seconds
        jsonRequest = await asyncio.shield( asyncio.wait_for( sock.recv(),  0.1) )
    except CancelledError:
        return
    except asyncio.exceptions.TimeoutError:
        return
    
    
    try:
        jsonRequest = json.loads(jsonRequest)
    except json.JSONDecodeError as e:
        forceGuiPrint(str(e))
    action = jsonRequest["action"]
    kwargs = jsonRequest["kwargs"]
    #forceGuiPrint(jsonRequest)
    #if ('channel' in kwargs):
    #    yodel.setChannel(int(kwargs["channel"]))

    insulatePassYodelCall(yodelResponses[action],kwargs)




async def checkOutgoingJSON(sock:websockets.server.WebSocketServerProtocol) -> NoReturn:
    '''
    checkOutgoingJSON checks the global Queue for messages that are ready to be sent back to the JS client.
    '''
    if (globals.outgoingMessages.empty()):
        return

    await sock.send(
        globals.outgoingMessages.get()
    )


async def yodelSuite(sock:websockets.server.WebSocketServerProtocol, path):
    '''
    yodelSuite just combines the functionality of incoming and outgoing JSON coroutines
    '''
    # Client loop:
    while True:
        # check for any ready incoming messages from the JS
        await checkIncomingJSON(sock)
        # check for any ready outgoing messages to the JS
        await checkOutgoingJSON(sock)
    


def beginServing():
    '''
    Basic setup for the WebSocket server, yodel, and a thread
    '''
    forceGuiPrint("Binding to port: ", globals.port)


    # This combination will allow the websocket server to run on the asyncio
    # event loop, and feed new connections through to the yodelSuite coroutine
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(yodelSuite, globals.host, globals.port)
    )
    # Setup yodel with the radio device
    yodel.startRadio(globals.yodelStartRadio)

    # Yodel will be operated through its own thread because it doesn't play nice with asyncio.
    # Yodel data is accepted in this thread, and given to the websocket thread through a global Queue
    yodelThread = Thread(target=yodelLoop, daemon=True)
    yodelThread.start()

    # mainloop
    asyncio.get_event_loop().run_forever()

    # uncreached
    yodelThread.join()
