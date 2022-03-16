import { Button } from "@nextui-org/react";
import * as React from "react";
import { FaUser } from 'react-icons/fa';

export default () => {
  const [mainItems, setMainItems] = React.useState([    ]);
  return (
    <Button shadow icon={<FaUser/>} flat color="primary" auto>
        Connect to a wallet
    </Button>
  );
}