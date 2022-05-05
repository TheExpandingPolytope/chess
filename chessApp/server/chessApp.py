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

    def __isInGame(self, address):
        return address in self.players
    
    def __isTurn(self, address):
        turn = self.board.turn
        if(turn == chess.WHITE):
            return self.players.index(address) == 0
        else:
            return self.players.index(address) > 0
    
    def __isMaxPlayers(self):
        return len(self.players) >= 2

    def __isMinPlayers(self):
        return len(self.players) >= 2

    def __isGameEnd(self):
        outcome = self.board.outcome()
        return outcome != None

    def addPlayer(self, address):
        try:
            canAdd = (not self.__isMaxPlayers()) and (not self.__isInGame(address))
            if(canAdd):
                self.players.append(address)
                return True
            return False
        except:
            return False
    
    def removePlayer(self, address):
        try:
            self.players.remove(address)
            return True
        except:
            return False

    def move(self, sender, moveString):
        app.logger.info("isMoving now")
        ##try:
        #Determine if player can move
        newMove = chess.Move.from_uci(moveString)
        isLegal = newMove in self.board.legal_moves
        isInGame = self.__isInGame(sender)
        isTurn = self.__isTurn(sender)
        isMinPlayers = self.__isMinPlayers()
        isGameEnd = self.__isGameEnd()
        
        #Log move state
        app.logger.info("isGameEnd: " + str(isGameEnd) + " isMinPlayers: " + str(isMinPlayers) + "isTurn: "+str(isTurn)+" isInGame: "+str(isInGame)+" isLegal: "+str(isLegal))

        canMove = isLegal and isInGame and isTurn and isMinPlayers and (not isGameEnd)
        if(canMove):
            #Handle move
            self.board.push(newMove)
            #Send end game notice
            isGameEnd = self.__isGameEnd()
            if(isGameEnd):
                send_notice(sender, "end", True)
            return True
        else:
            return False
        ##except:
        ##    return False

    def undo(self):
        try:
            self.board.pop()
            return True
        except:
            return False

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
        return False
    
    def isInGame(self, sender):
        return self.getByPlayer(sender) != False

    def create(self, sender):
        canCreate = not self.isInGame(sender)
        if(canCreate):
            id = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
            self.games[str(id)] = Game(id)
            return self.games[str(id)].addPlayer(sender)
        return False

    
    def remove(self, id):
        self.games.pop(id)
        return True

    def join(self, id, sender):
        game = self.games[id]
        return game.addPlayer(sender)

    def leave(self, sender):
        game = self.getByPlayer(sender)
        return game.removePlayer(sender)

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

def format_to_input(sender, operation, success):
    data_set = {
        "sender": sender, 
        "operation": operation, 
        "success": success
    }
    json_dump = json.dumps(data_set)
    return json_dump

def convert_to_hex(s_input):
    return "0x"+str(s_input.encode("utf-8").hex())

def send_notice(sender, operation, success):
    json_object = format_to_input(sender, operation, success)
    app.logger.info("Sending notice : "+ json_object)
    hex_string = convert_to_hex(json_object)
    response = requests.post(dispatcher_url + "/notice", json={"payload": hex_string})
    app.logger.info(f"Received notice status {response.status_code} body {response.content}")
    app.logger.info("New PayLoad Added: "+ hex_string)
    app.logger.info("Adding notice")


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

    #Handle operator
    success = False
    if operator == "create":
        success = matchMaker.create(sender)
    elif operator == "join":
        success = matchMaker.join(value, sender)
    elif operator == "leave":
        success = matchMaker.leave(sender)
    elif operator == "move":
        game = matchMaker.getByPlayer(sender)
        success = game.move(sender, value)
    elif operator == "undo":
        game = matchMaker.getByPlayer(sender)
        success = game.undo()
    
    #Send notice on state change
    send_notice(sender, operator, success)

    #Set new state
    result = matchMaker.getStringState()
    app.logger.info("This should be the calculation result : " + result)

    #Encode back to Hex to add in the notice
    newpayload = "0x"+str(result.encode("utf-8").hex())
    app.logger.info("Operation Result in Hex: " + newpayload)

    #Handle Finish, Close machine
    app.logger.info("Finishing")
    response = requests.post(dispatcher_url + "/finish", json={"status": "accept"})
    app.logger.info(f"Received finish status {response.status_code}")
    return "", 202


@app.route("/inspect/<payload>", methods=["GET"])
def inspect(payload):
    app.logger.info(f"Received inspect request payload {payload}")
    return {"reports": [{"payload": payload}]}, 200



