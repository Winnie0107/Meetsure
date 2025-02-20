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
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
} from "@chakra-ui/react";
import { FiFile, FiChevronDown } from "react-icons/fi"; // 引入文件圖示和下箭頭圖示
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState } from "react";

function AITranslate() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // State for the input text and language settings
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [detectedLanguage, setDetectedLanguage] = useState("中文");
    const [targetLanguage, setTargetLanguage] = useState("英文");
    const [copyStatus, setCopyStatus] = useState("複製文本"); // 用於按鈕顯示文字

    // Example function to simulate translation
    const translateText = () => {
        const translation = `翻譯結果：${inputText}（從${detectedLanguage}翻譯到${targetLanguage}）`;
        setTranslatedText(translation);
    };

    // Function to copy the translated text to clipboard
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(translatedText).then(() => {
            setCopyStatus("已複製！"); // 更新按鈕文字
            setTimeout(() => setCopyStatus("複製文本"), 2000); // 2秒後恢復原文字
        }, (err) => {
            console.error("複製失敗:", err);
        });
    };

    // 選擇的語言選項
    const languageOptions = ["日文", "韓文", "西班牙文", "法文", "德文"];

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            <Grid templateColumns={{ sm: "1fr", lg: "1fr 1fr" }} gap="24px">
                {/* 左邊的翻譯區域 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            AI翻譯 - 輸入
                        </Text>
                    </CardHeader>
                    <CardBody>
                        {/* 選擇來源語言的按鈕 */}
                        <Stack direction="row" spacing={0} mb="4">
                            {["偵測語言", "中文", "英文"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={detectedLanguage === option ? "teal" : "gray"}
                                    onClick={() => setDetectedLanguage(option)}
                                    borderRadius={option === "偵測語言" ? "8px 0 0 8px" : option === "英文" ? "0 8px 8px 0" : "0"}
                                >
                                    {option}
                                </Button>
                            ))}
                        </Stack>

                        {/* 輸入文字框 */}
                        <Textarea
                            placeholder="在這裡輸入文本..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            borderColor={borderColor}
                            mb="6"
                            minH="300px" // 增加最小高度
                        />

                        {/* 翻譯按鈕 */}
                        <Flex justify="flex-end">
                            <Button colorScheme="teal" onClick={translateText}>
                                翻譯
                            </Button>
                        </Flex>
                    </CardBody>
                </Card>

                {/* 右邊的翻譯結果區域 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Flex justify="space-between" alignItems="center">
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                AI翻譯 - 結果
                            </Text>
                            {/* 複製按鈕 */}
                            <Button
                                colorScheme="gray" // 淺灰色
                                onClick={handleCopyToClipboard}
                                leftIcon={<Icon as={FiFile} />}
                                borderRadius="8px" // 設置圓角
                            >
                                {copyStatus} {/* 顯示複製狀態 */}
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        {/* 語言選擇按鈕 */}
                        <Stack direction="row" spacing={0} mb="4">
                            {["中文", "英文"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={targetLanguage === option ? "teal" : "gray"}
                                    onClick={() => setTargetLanguage(option)}
                                    borderRadius={option === "中文" ? "8px 0 0 8px" : "0"}
                                >
                                    {option}
                                </Button>
                            ))}
                            {/* 下拉選單按鈕 */}
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<Icon as={FiChevronDown} />}
                                    colorScheme="gray"
                                    borderRadius="0 8px 8px 0" // 設置圓角
                                >
                                    選擇語言
                                </MenuButton>
                                <MenuList>
                                    {languageOptions.map((language) => (
                                        <MenuItem key={language} onClick={() => setTargetLanguage(language)}>
                                            {language}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </Stack>

                        {/* 使用 Textarea 顯示翻譯結果 */}
                        <Textarea
                            value={translatedText}
                            readOnly
                            borderColor={borderColor}
                            minH="300px" // 增加最小高度
                            overflowY="auto"
                        />
                    </CardBody>
                </Card>
            </Grid>
        </Flex>
    );
}

export default AITranslate;
