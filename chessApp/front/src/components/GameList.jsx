import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGames } from "../store/game/gameSlice";
import { Text, Grid, Button, Spacer, Card, Row, Pagination, Divider, Table} from "@nextui-org/react";
import { Chessboard } from "react-chessboard";
import { Link, NavLink } from "react-router-dom";
import GameListItem from "./GameListItem";


export default () => {
    const games = useSelector(state => state.game.games);
    const dispatch = useDispatch()

    return (
        <div className="gameListItem">
            <Card shadow={true} css={{ height:"700px", width: "1000px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                <Card.Header>
                    <Row justify="center">
                        <Text>Active games</Text>
                    </Row>
                </Card.Header>
                <GameListItem/>
            </Card>
            
        </div> 
    );
}