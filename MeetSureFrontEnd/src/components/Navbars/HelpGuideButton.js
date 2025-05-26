import React, { useState } from "react";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";
import InfoGuideModal from "./InfoGuideModal";

export default function HelpGuideButton() {
  const modal = useDisclosure();
  const [showTooltip, setShowTooltip] = useState(true); // 每次刷新預設顯示

  const handleOpen = () => {
    modal.onOpen();
    setShowTooltip(false); // 點過後關閉提示
  };

  return (
    <>
      <Tooltip
        label="查看使用指南！"
        isOpen={showTooltip}
        hasArrow
        placement="top"
        bg="#E57373"
        color="white"
        fontWeight="bold"
        fontSize="sm"
        borderRadius="md"
        px={3}
        py={2}
        boxShadow="md"
        _arrow={{
          bg: "red.500",
        }}
      >
        <Button
          onClick={handleOpen}
          variant="ghost"
          color="white"
          _hover={{ bg: "gray.600" }}
          p="0"
          h="auto"
          minW="auto"
        >
          <QuestionIcon boxSize={7} />
        </Button>
      </Tooltip>
      <InfoGuideModal isOpen={modal.isOpen} onClose={modal.onClose} />
    </>
  );
}