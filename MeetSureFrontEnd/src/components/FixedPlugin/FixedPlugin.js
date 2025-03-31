// Chakra Imports
/* eslint-disable no-unused-vars */
import { Button, useColorModeValue } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import React from "react";

export default function ChatButton(props) {
  const { onOpen } = props;
  const chatRef = React.useRef();

  // 設定色系為 teal.600
  const navbarIcon = "white"; 
  const bgButton = useColorModeValue(
    "linear-gradient(135deg, #319795, #2c7a7b)", // 亮色模式
    "linear-gradient(135deg, #2c7a7b, #285e61)"  // 暗色模式
  );
  const hoverBgButton = useColorModeValue(
    "linear-gradient(135deg, #2c7a7b, #285e61)", 
    "linear-gradient(135deg, #285e61, #234e52)"
  );

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        h="70px"
        w="70px"
        onClick={onOpen}
        bg={bgButton}
        position="fixed"
        variant="solid"
        bottom="30px"
        right="35px"
        borderRadius="50px"
        boxShadow="0px 0px 20px rgba(50, 150, 150, 0.6)" // 霓虹光效 (teal)
        _hover={{
          bg: hoverBgButton,
          transform: "scale(1.15)",
          boxShadow: "0px 0px 25px rgba(50, 150, 150, 0.8)", // 更強霓虹光暈
        }}
        _active={{
          transform: "scale(0.9)",
          boxShadow: "0px 0px 30px rgba(50, 150, 150, 1)", // 點擊時增加亮度
        }}
        _after={{
          content: '""',
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(50, 150, 150, 0.6)",
          animation: "pulse 1.5s infinite",
        }}
      >
        <ChatIcon
          cursor="pointer"
          ref={chatRef}
          color={navbarIcon}
          w="32px"
          h="32px"
        />
      </Button>
    </motion.div>
  );
}
