import * as React from "react";
import { Text, Grid, MockItem, Button, Spacer, Card, Pagination, Divider} from "@nextui-org/react";
import "./Body.css"
import { FaPlay } from 'react-icons/fa';

export default () => {
    const [mainItems, setMainItems] = React.useState([]);
    return (
        <div class="body">
            <div class="header">
                <Text h1 size={100}>Ultrachess</Text> 
                <Text>Immutable chess backed by blockchain technology, with more than just your elo at stake</Text>
            </div>
            <div class="buttons">
                <Button color="gradient" shadow>
                    Quick play
                </Button>
                <Spacer x={1}/>
                <Button light color="default" shadow>
                    Create game
                </Button>
            </div>
            <div class="content">
                <Card shadow={true} css={{ height:"700px", width: "600px", display:"flex", alignContent:"center", justifyContent:"center", }}>
                    <Card.Header css={{paddingLeft:"10px"}}>
                        <Button.Group size="lg" light>
                           
                        </Button.Group>
                    </Card.Header>
                </Card>
            </div>
        </div>    
    );
}