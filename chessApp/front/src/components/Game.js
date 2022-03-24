import { Button } from "@nextui-org/react";
import * as React from "react";
import { FaUser } from 'react-icons/fa';
import { Chessboard } from "react-chessboard";

import "./Game.css"

export default () => {
  const [mainItems, setMainItems] = React.useState([    ]);

  React.useEffect(()=>{
  })

  return (
    <div class="game">
        <div class="gameView">
            <Chessboard id="BasicBoard" />

        </div>
    </div>
  );
}