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
import string
import random
sys.path.append('/mnt/chessApp-dapp/env/lib/python3.8/site-packages')
print(sys.path)
import chess
from flask import Flask, request

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
board = chess.Board()

dispatcher_url = environ["HTTP_DISPATCHER_URL"]
app.logger.info(f"HTTP dispatcher url is {dispatcher_url}")

#List of active games
games = {}

class Game:
    def __init__(self, id):
        self.id = id
        self.players = []
        self.board = chess.Board()

    def addPlayer(self, address):
        self.players.append(address)
        return self
    
    def removePlayer(self, address):
        self.players.remove(address)
        return self

    def move(self, sender, moveString):
        newMove = chess.Move.from_uci(moveString)
        self.board.push(newMove)
        return self

    def undo(self):
        self.board.pop()
        return self

class Matchmaker:
    def __init__(self):
        self.games = {}

    def get(self, id):
        return self.games[str(id)]

    def getByPlayer(self, address):
        for key in self.games:
            game = self.games[str(key)]
            if(address in game.players):
                return game
        return

    def create(self, sender):
        id = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
        self.games[str(id)] = Game(id)
        self.games[str(id)].addPlayer(sender)
        return self.games[str(id)]
    
    def remove(self, id):
        self.games.pop(id)
        return self.games[str(id)]

    def join(self, id, sender):
        self.games[id].addPlayer(sender)
        return self.games[str(id)]

    def leave(self, sender):
        game = self.getByPlayer(sender)
        game.removePlayer(sender)
        return self.games[str(id)]

    def getStringState(self):
        newGames = {}
        for key in self.games:
            game = self.games[str(key)]
            gamePartial = {
                "id":game.id,
                "players": game.players,
                "board_fen": game.board.fen()
            }
            newGames[key] = gamePartial
        return str(newGames)

    
matchMaker = Matchmaker()

@app.route("/advance", methods=["POST"])
def advance():
    #gets json string in Hexadecimal and converts to normal string
    body = request.get_json()
    metadata = body["metadata"]

    partial = body["payload"][2:]    
    content = (bytes.fromhex(partial).decode("utf-8"))

    #Extracts operands and operator, calls the function and gets result
    s_json = json.loads(content)

    #Extract message values
    operator = s_json["op"]
    value = s_json["value"]
    sender = metadata["msg_sender"]
    epochIndex = metadata["epoch_index"]
    inputIndex = metadata["input_index"]
    blockNumber = metadata["block_number"] 

    #Log values
    app.logger.info(f"Received advance request body {body}")
    app.logger.info("Printing Body Payload : "+ body["payload"])
    app.logger.info("Hex Without 0x : "+ partial)
    app.logger.info("You are doing a " + str(operator) + " operation")
    app.logger.info("With a value of " + str(value))

    if operator == "create":
        matchMaker.create(sender)
        result = matchMaker.getStringState()
    elif operator == "join":
        matchMaker.join(value, sender)
        result = matchMaker.getStringState()
    elif operator == "leave":
        matchMaker.leave(sender)
        result = matchMaker.getStringState()
    elif operator == "move":
        game = matchMaker.getByPlayer(sender)
        game.move(sender, value)
        result = matchMaker.getStringState()
    elif operator == "undo":
        game = matchMaker.getByPlayer(sender)
        game.undo()
        result = matchMaker.getStringState()
    else:
        result = "The operation is invalid"

    app.logger.info("This should be the calculation result : " + result)


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
