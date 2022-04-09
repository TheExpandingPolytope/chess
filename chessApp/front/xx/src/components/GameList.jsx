import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import GameListItem from "./GameListItem";
import { fetchGames } from "../store/game/gameSlice";
import { Text, Grid, Button, Spacer, Card, Pagination, Divider, Table} from "@nextui-org/react";
import { Chessboard } from "react-chessboard";


export default () => {
    const games = useSelector(state => state.game.games);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    return (
        <div className="gameListItem">
            <Card shadow={true} css={{ height:"700px", width: "800px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                <Table
                    aria-label="Example table with static content"
                    css={{
                        height: "auto",
                        minWidth: "100%",
                    }}
                >
                    <Table.Header>
                        <Table.Column>Id</Table.Column>
                        <Table.Column>Players</Table.Column>
                        <Table.Column>Mode</Table.Column>
                        <Table.Column></Table.Column>
                    </Table.Header>
                    <Table.Body items={games}>
                        {(item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item.id}</Table.Cell>
                                <Table.Cell>{item.players}</Table.Cell>
                                <Table.Cell>blitz</Table.Cell>
                                <Table.Cell>
                                    <Chessboard 
                                        id={item.id}
                                        position={item.fen}
                                        boardWidth={300}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Card>
            
        </div> 
    );
}