// UsersTableRow.js
import React from "react";
import { Tr, Td } from "@chakra-ui/react";

function UsersTableRow({ mail, password, level }) {
    return (
        <Tr>
            <Td>{mail}</Td>
            <Td>{password}</Td>
            <Td>{level}</Td>
        </Tr>
    );
}

export default UsersTableRow;
