import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Button,
  VStack,
  Text,
  Box,
  IconButton,
  Flex,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import MeetSureLogo from "assets/img/MeetSureLogo.png";

export default function ChatDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "Meetsure機器人", content: "您好！請輸入您的問題。" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const botMessageBg = useColorModeValue("gray.100", "gray.700");
  const userMessageBg = useColorModeValue("teal.500", "teal.500");
  const userTextColor = "white";
  const textColor = useColorModeValue("black", "white");
  const drawerBg = useColorModeValue("white", "gray.800");
  const sendButtonColor = "teal.500";

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = { sender: "You", content: inputValue };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch("http://localhost:3001/api/v1/workspace/zhi-workspace/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 06JBKJC-TPJ46K5-KCRNVPS-M66G24D",
          "accept": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          mode: "chat",
          sessionId: "same-session-id",
        }),
      });
      const data = await response.json();
      
      const botMessage = { sender: "Meetsure機器人", content: data.textResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [...prev, { sender: "Meetsure機器人", content: "發送請求失敗，請稍後再試。" }]);
    }

    setInputValue("");
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
      <DrawerOverlay />
      <DrawerContent bg={drawerBg} borderLeftRadius="md">
        {/* Header 排版修正 */}
        <DrawerHeader display="flex" alignItems="center" borderBottom="1px solid #E2E8F0" py={3}>
          <Flex align="center">
            {/* ✅ 修正圖片比例，確保不變形 */}
            <Image src={MeetSureLogo} alt="MeetSure Logo" height="36px" width="auto" mr={3} flexShrink={0} />
            <Text fontWeight="bold" fontSize="lg">Meetsure自動回覆</Text>
          </Flex>
          {/* ✅ 讓關閉按鈕自動對齊右側 */}
          <IconButton icon={<CloseIcon />} size="sm" onClick={onClose} variant="ghost" ml="auto" />
        </DrawerHeader>

        {/* Message Body */}
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {messages.map((msg, index) => (
              <Box
                key={index}
                alignSelf={msg.sender === "You" ? "flex-end" : "flex-start"}
                bg={msg.sender === "You" ? userMessageBg : botMessageBg}
                color={msg.sender === "You" ? userTextColor : textColor}
                px={4}
                py={3}
                borderRadius="lg"
                boxShadow="md"
                maxWidth="75%"
              >
                <Text>{msg.content}</Text>
              </Box>
            ))}
          </VStack>
        </DrawerBody>

        {/* Input Area */}
        <Flex p={4} borderTop="1px solid #E2E8F0" alignItems="center">
          <Input
            placeholder="輸入訊息..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            flex={1}
            borderRadius="md"
          />
          <Button ml={2} bg={sendButtonColor} color="white" _hover={{ bg: "teal.600" }} onClick={handleSendMessage} borderRadius="md">
            傳送
          </Button>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}
