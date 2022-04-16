import { Button } from "@nextui-org/react";
import * as React from "react";
import { FaUser } from 'react-icons/fa';
import { Chessboard } from "react-chessboard";

import "./Game.css"
import { useParams } from "react-router-dom";
import { getGameById } from "../store/game/gameHelper";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default () => {
  let { gameId } = useParams()
  const games = useSelector(state => state.game.games);

  var game = getGameById(games, gameId)
  useEffect(() => {
    
  })
    console.log(games)
  return (
    <div className="game">
        <div className="gameView">
            <Chessboard 
              id={game.id} 
              position={game.fen}
            />
        </div>
    </div>
  );
}