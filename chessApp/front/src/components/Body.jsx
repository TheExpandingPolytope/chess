import * as React from "react";
import { Text, Grid, Button, Spacer, Card, Pagination, Divider, Table} from "@nextui-org/react";
import "./Body.css"
import { FaPlay } from 'react-icons/fa';
import GameList from "./GameList";

export default () => {
    const [mainItems, setMainItems] = React.useState([]);
    return (
        <div className="body">
            <div className="header">
                <Text h2 size={90}>Ultrachess.org</Text> 
                <Text>Immutable chess backed by blockchain technology, with more than just your elo at stake</Text>
            </div>
            <div className="buttons">
                <Button color="gradient" shadow>
                    Quick play
                </Button>
                <Spacer x={1}/>
                <Button light color="default" shadow>
                    Create game
                </Button>
            </div>
            <div className="content">
                <GameList/>
            </div>
        </div>    
    );
}