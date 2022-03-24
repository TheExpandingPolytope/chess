import * as React from "react";
import { Text, Grid, MockItem, Button, Spacer, Card, Pagination, Divider} from "@nextui-org/react";
import "./Body.css"
import { FaPlay } from 'react-icons/fa';

export default () => {
    const [mainItems, setMainItems] = React.useState([]);
    return (
        <div class="body">
            <div class="header">
                <Text h2 size={90}>Ultrachess.org</Text> 
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
                <Card shadow={true} css={{ height:"700px", width: "800px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                    <table>
                        <caption>
                            <div class="tab">
                                <button class="tablinks" onclick="openCity(event, 'London')">Lobby</button>
                                <button class="tablinks" onclick="openCity(event, 'Paris')">Open games</button>
                            </div>
                        </caption>
                        <thead>
                            <tr>
                            <th scope="col">Player</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Time</th>
                            <th scope="col">Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td scope="row">Buzzcocks</td>
                            <td>1976</td>
                            <td>9</td>
                            <td>Ever fallen in love</td>
                            </tr>
                            <tr>
                            <th scope="row">The Clash</th>
                            <td>1976</td>
                            <td>6</td>
                            <td>London Calling</td>
                            </tr>

                            <tr>
                            <th scope="row">The Stranglers</th>
                            <td>1974</td>
                            <td>17</td>
                            <td>No More Heroes</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                            <th scope="row" colspan="2">Total albums</th>
                            <td colspan="2">77</td>
                            </tr>
                        </tfoot>
                    </table>
                </Card>
            </div>
        </div>    
    );
}