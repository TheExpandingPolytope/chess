import { Button } from "@nextui-org/react";
import * as React from "react";

export default () => {
  const [mainItems, setMainItems] = React.useState([    ]);
  return (
    <Button shadow flat color="primary" auto>
        Connect to a wallet
    </Button>
  );
}