from typing import *
import json
import websockets
import threading
import argparse
import globals
import yodelEnvironment




if (__name__ == "__main__"):

    argparser = argparse.ArgumentParser(
        prog="YodelAPI-server",
        description="The server for the yodel api."
    )
    # Setup arguments with device name, and portnumber
    argparser.add_argument("radioDevice",help="The name of your WiFi radio device. For help finding your device name, go to https://github.com/aldenq/Yodel.")
    argparser.add_argument("--portno","-P",help="The port number to bind to", required=False)
    argparser.add_argument("--host", "-H", help="The host name to bind to", required=False)
    argparser.add_argument("--gui", help="Internal use for gui", required=False, action="store_true")
    arguments = argparser.parse_args()
    if arguments.portno is not None:
        globals.port = arguments.portno
    if arguments.host is not None:
        globals.host = arguments.host
    globals.gui = arguments.gui
    # sore the radio name for setup later
    globals.yodelStartRadio = arguments.radioDevice
    # principle setup function for the WebSocket, threading, and basic yodel calls
    yodelEnvironment.beginServing()
