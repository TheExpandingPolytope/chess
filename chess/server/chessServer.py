# Copyright 2022 Cartesi Pte. Ltd.
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.


from os import environ
import logging
import requests 
import json
import sys
sys.path.append('/mnt/chessServer-dapp/env/lib/python3.8/site-packages')
print(sys.path)
import chess
from flask import Flask, request

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
board = chess.Board()

dispatcher_url = environ["HTTP_DISPATCHER_URL"]
app.logger.info(f"HTTP dispatcher url is {dispatcher_url}")

#Rung game functions

# This function moves a piece on the board
def move(moveString):
    newMove = chess.Move.from_uci(moveString)
    board.push(newMove)
    return board.fen()

# Undo last action on the board
def undo():
    board.pop()
    return board.fen()


@app.route("/advance", methods=["POST"])
def advance():
    #gets json string in Hexadecimal and converts to normal string
    body = request.get_json()
    app.logger.info(f"Received advance request body {body}")
    app.logger.info("Printing Body Payload : "+ body["payload"])

    partial = body["payload"][2:]
    app.logger.info("Hex Without 0x : "+ partial)
    content = (bytes.fromhex(partial).decode("utf-8"))
    #Extracts operands and operator, calls the function and gets result
    s_json = json.loads(content)
    #Extract operation
    operator = s_json["op"]
    app.logger.info("You are doing a " + str(operator) + " operation")
    #Extract value
    value = float(s_json["value"])
    app.logger.info("With a value of " + str(value))

    if operator == "move":
        result = move(value)
    elif operator == "undo":
        result = undo()
    else:
        result = "The operation is invalid"

    app.logger.info("This should be the calculation result : " + result)

    #Print ascii version of board
    print(board)

    #Encode back to Hex to add in the notice
    newpayload = "0x"+str(result.encode("utf-8").hex())
    app.logger.info("Operation Result in Hex: " + newpayload)
    body["payload"] = newpayload
    app.logger.info("New PayLoad Added: "+body["payload"])
    app.logger.info("Adding notice")
    response = requests.post(dispatcher_url + "/notice", json={"payload": body["payload"]})
    app.logger.info(f"Received notice status {response.status_code} body {response.content}")
    app.logger.info("Finishing")
    response = requests.post(dispatcher_url + "/finish", json={"status": "accept"})
    app.logger.info(f"Received finish status {response.status_code}")
    return "", 202


@app.route("/inspect/<payload>", methods=["GET"])
def inspect(payload):
    app.logger.info(f"Received inspect request payload {payload}")
    return {"reports": [{"payload": payload}]}, 200
