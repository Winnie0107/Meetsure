import React from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";
import InfoGuideModal from "./InfoGuideModal";

export default function HelpGuideButton() {
  const modal = useDisclosure();

  return (
    <>
      <Button
        onClick={modal.onOpen}
        variant="ghost"
        color="white"
        _hover={{ bg: "gray.600" }}
        p="0"
        h="auto"
        minW="auto"
      >
        <QuestionIcon boxSize={7} />
      </Button>
      <InfoGuideModal isOpen={modal.isOpen} onClose={modal.onClose} />
    </>
  );
}
