import * as React from "react";
import Auth from "./Auth";
import Title from "./Title";
import { Text, Spacer, Button } from "@nextui-org/react";
import "./Navbar.css"

export default () => {
  const [mainItems, setMainItems] = React.useState([]);
  return (
    <nav >
      <div class="center">
        <div class="nav-left">
          <img class="item" src={require("../assets/horse.png")} className="Logo" alt="logo" />
          <Spacer x={2}/>
          <Button light color="default" auto>Play</Button>
          <Spacer x={0.5}/>
          <Button light color="default" auto>About</Button>
          <Spacer x={0.5}/>
          <Button light color="default" auto>Rankings</Button>
        </div>
        <div class="nav-right">
          <Auth/>
        </div>
      </div>
      
    </nav>
  );
}