import * as React from "react";
import { Table} from "@nextui-org/react";

 
export default (props) => {
    const { id, players, fen } = props
    return (
        <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{players}</Table.Cell>
            <Table.Cell>{fen}</Table.Cell>
        </Table.Row>
    );
}