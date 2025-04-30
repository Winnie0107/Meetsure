import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import MeetSure from "./MeetSure";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

export default function AdminMeetSurePage() {
    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            <MeetSure mode="simple" />
        </Flex>
    );
}
