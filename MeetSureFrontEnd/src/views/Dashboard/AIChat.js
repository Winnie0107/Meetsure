// Chakra imports
import {
    Flex,
    Box,
    Input,
    Button,
    Text,
    VStack,
    HStack,
    Image,
    useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState } from "react";
import axios from 'axios'; // 引入 Axios

function AIChat() {
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const [selectedChat, setSelectedChat] = useState("ChatGpt-4o");
    const chatOptions = ["ChatGpt-4o", "ChatGpt-4o mini"];
    const [chatMessages, setChatMessages] = useState({
        "ChatGpt-4o": [{ sender: "AI", text: "歡迎來到 ChatGpt-4o 聊天室！" }],
        "ChatGpt-4o mini": [{ sender: "AI", text: "歡迎來到 ChatGpt-4o mini 聊天室！" }],
    });
    const [inputValue, setInputValue] = useState("");

    // 发送消息到 OpenAI API
    const sendMessageToAPI = async (message) => {
        try {
            console.log("Sending message to API:", message);

            const response = await axios.post(
                "http://127.0.0.1:8000/chatgpt/",  // 改為 Django API
                { message },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            return response.data.response;
        } catch (error) {
            console.error("Error while calling the API:", error.response ? error.response.data : error.message);
            return "抱歉，無法獲取回應。";
        }
    };



    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        const userMessage = { sender: "You", text: inputValue };
        setChatMessages((prevMessages) => ({
            ...prevMessages,
            [selectedChat]: [...prevMessages[selectedChat], userMessage],
        }));
        setInputValue("");

        // 调用 API 获取 AI 回复
        const aiMessageText = await sendMessageToAPI(inputValue);
        const aiMessage = { sender: "AI", text: aiMessageText };

        setChatMessages((prevMessages) => ({
            ...prevMessages,
            [selectedChat]: [...prevMessages[selectedChat], aiMessage],
        }));
    };

    const getIconForChat = (option) => {
        if (option === "ChatGpt-4o") {
            return "/gpt-4.png";
        } else if (option === "ChatGpt-4o mini") {
            return "/gpt-3.5.png";
        }
        return "";
    };

    return (
        <Flex direction="row" pt={{ base: "120px", md: "75px" }} gap="24px">
            <Card w="20%" overflowX={{ sm: "scroll", xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        Chat Room
                    </Text>
                </CardHeader>
                <CardBody>
                    <VStack align="start">
                        {chatOptions.map((option) => (
                            <Button
                                key={option}
                                w="full"
                                colorScheme={selectedChat === option ? "teal" : "gray"}
                                onClick={() => setSelectedChat(option)}
                                leftIcon={
                                    <Image
                                        src={getIconForChat(option)}
                                        boxSize="20px"
                                        alt={`${option} icon`}
                                    />
                                }
                            >
                                {option}
                            </Button>
                        ))}
                    </VStack>
                </CardBody>
            </Card>

            <Card w="80%" overflowX={{ sm: "scroll", xl: "hidden" }} h="80vh">
                <CardHeader p="6px 0px 22px 0px">
                    <HStack>
                        <Image
                            src={getIconForChat(selectedChat)}
                            boxSize="24px"
                            alt={`${selectedChat} icon`}
                        />
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            {selectedChat} 聊天室
                        </Text>
                    </HStack>
                </CardHeader>
                <CardBody h="100%">
                    <Flex direction="column" justifyContent="space-between" h="100%">
                        <Box
                            border="1px"
                            borderColor={borderColor}
                            borderRadius="md"
                            p="4"
                            mb="4"
                            flex="1"
                            overflowY="auto"
                        >
                            <VStack align="start" spacing={3}>
                                {chatMessages[selectedChat].map((message, index) => (
                                    <Box
                                        key={index}
                                        alignSelf={message.sender === "You" ? "flex-end" : "flex-start"}
                                        bg={message.sender === "You" ? "teal.500" : "gray.200"}
                                        color={message.sender === "You" ? "white" : "black"}
                                        p="2"
                                        borderRadius="md"
                                        maxW="70%"
                                    >
                                        <Text fontWeight="bold">{message.sender}</Text>
                                        <Text>{message.text}</Text>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>

                        <HStack>
                            <Input
                                placeholder="輸入訊息..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                borderColor={borderColor}
                            />
                            <Button colorScheme="teal" onClick={handleSendMessage}>
                                發送
                            </Button>
                        </HStack>
                    </Flex>
                </CardBody>
            </Card>
        </Flex>
    );
}

export default AIChat;