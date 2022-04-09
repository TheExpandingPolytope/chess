import * as React from "react";
import Auth from "./Auth";
import Title from "./Title";
import { Text, Spacer, Button } from "@nextui-org/react";
import "./Navbar.css"
import { Link } from "react-router-dom";
import logo from "../assets/horse.png"

export default () => {
  const [mainItems, setMainItems] = React.useState([]);
  return (
    <nav >
      <div className="center">
        <div className="nav-left">
          <Link to="/"><img className="item" src="src/assets/horse.png" alt="logo" /></Link>
          <Spacer x={2}/>
          <Button light color="default" auto><Link color="default" to="/game">Play</Link></Button>
          <Spacer x={0.5}/>
          <Button light color="default" auto>About</Button>
          <Spacer x={0.5}/>
          <Button light color="default" auto><Link to="/rankings">Rankings</Link></Button>
        </div>
        <div className="nav-right">
          <Auth/>
        </div>
      </div>
      
    </nav>
  );
}