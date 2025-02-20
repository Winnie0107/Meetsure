// Chakra imports
/* eslint-disable no-unused-vars */

import {
    Flex,
    Box,
    Grid,
    Text,
    Textarea,
    Button,
    Stack,
    useColorModeValue,
    Icon
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi"; // 引入文件圖示
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState } from "react";

function AIWrite() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // State for the email content and settings
    const [emailContent, setEmailContent] = useState("");
    const [length, setLength] = useState("短");
    const [format, setFormat] = useState("電子郵件");
    const [tone, setTone] = useState("正式");
    const [language, setLanguage] = useState("中文");
    const [copyStatus, setCopyStatus] = useState("複製文本"); // 用於按鈕顯示文字

    // Example function to simulate email generation
    const generateEmail = () => {
        let generatedContent = `這是一篇${format}，語氣${tone}，長度${length}的內容。\n\n${emailContent}`;
        return language === "中文" ? generatedContent : "This is a " + format + " with a " + tone + " tone and " + length + " length.\n\n" + emailContent;
    };

    // Function to copy the generated email content to clipboard
    const handleCopyToClipboard = () => {
        const content = generateEmail();
        navigator.clipboard.writeText(content).then(() => {
            setCopyStatus("已複製！"); // 更新按鈕文字
            setTimeout(() => setCopyStatus("複製文本"), 2000); // 2秒後恢復原文字
        }, (err) => {
            console.error("複製失敗:", err);
        });
    };

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            <Grid templateColumns={{ sm: "1fr", lg: "1fr 1fr" }} gap="24px">
                {/* 左邊的撰寫區域 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            信件撰寫
                        </Text>
                    </CardHeader>
                    <CardBody>
                        {/* 撰寫信件的 Textarea */}
                        <Textarea
                            placeholder="在這裡撰寫您的信件..."
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            borderColor={borderColor}
                            mb="6"
                            minH="200px"
                        />

                        {/* 選擇信件長度 */}
                        <Text fontWeight="bold" mb="2">信件長度</Text>
                        <Stack direction="row" spacing={4} mb="4">
                            {["短", "中等", "長"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={length === option ? "teal" : "gray"}
                                    onClick={() => setLength(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </Stack>

                        {/* 選擇信件格式 */}
                        <Text fontWeight="bold" mb="2">信件格式</Text>
                        <Stack direction="row" spacing={4} mb="4">
                            {["電子郵件", "訊息", "評論", "文章", "想法"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={format === option ? "teal" : "gray"}
                                    onClick={() => setFormat(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </Stack>

                        {/* 選擇語氣 */}
                        <Text fontWeight="bold" mb="2">語氣</Text>
                        <Stack direction="row" spacing={4} mb="4">
                            {["正式", "友善", "隨意", "專業"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={tone === option ? "teal" : "gray"}
                                    onClick={() => setTone(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </Stack>

                        {/* 選擇輸出語言 */}
                        <Text fontWeight="bold" mb="2">輸出語言</Text>
                        <Stack direction="row" spacing={4} mb="6">
                            {["中文", "英文"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={language === option ? "teal" : "gray"}
                                    onClick={() => setLanguage(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </Stack>

                        {/* 生成信件按鈕放在右下方 */}
                        <Flex justify="flex-end">
                            <Button colorScheme="teal" onClick={generateEmail}>
                                生成信件
                            </Button>
                        </Flex>
                    </CardBody>
                </Card>

                {/* 右邊的信件預覽區域 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px" display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            信件預覽
                        </Text>
                        {/* 複製按鈕 */}
                        <Button
                            colorScheme="gray" // 淺灰色
                            onClick={handleCopyToClipboard}
                            leftIcon={<Icon as={FiFile} />} // 添加文件圖示
                        >
                            {copyStatus} {/* 顯示複製狀態 */}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <Textarea
                            value={generateEmail()} // 使用生成信件的函數
                            readOnly // 設置為只讀
                            borderColor={borderColor} // 邊框顏色
                            minH="500px" // 增加最小高度
                            resize="vertical" // 允許垂直調整大小
                            overflowY="auto" // 垂直溢出時顯示滾動條
                        />
                    </CardBody>
                </Card>
            </Grid>
        </Flex>
    );
}

export default AIWrite;
