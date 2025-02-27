import {
    Flex,
    Grid,
    Text,
    Textarea,
    Button,
    Stack,
    useColorModeValue,
    Icon,
    ButtonGroup,
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState } from "react";
import axios from "axios";

function AIWrite() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // 狀態管理
    const [emailContent, setEmailContent] = useState("");
    const [length, setLength] = useState("短");
    const [format, setFormat] = useState("電子郵件");
    const [tone, setTone] = useState("正式");
    const [language, setLanguage] = useState("中文");
    const [generatedContent, setGeneratedContent] = useState("");
    const [copyStatus, setCopyStatus] = useState("複製文本");

    // 生成 AI 內容
    const handleGenerateEmail = async () => {
        if (!emailContent.trim()) {
            alert("請輸入關鍵詞！");
            return;
        }

        let prompt = `請用 "${language}" 撰寫一篇內容，基於 "${emailContent}"，要求格式為 "${format}"，語氣為 "${tone}"，長度為 "${length}"。`;

        // 根據選擇的格式提供不同的請求內容
        switch (format) {
            case "訊息":
                prompt = `請用 "${language}" 撰寫一則可於聊天室傳送的訊息，內容圍繞 "${emailContent}，語氣為 "${tone}"，長度為 "${length}"。`;
                break;
            case "評論":
                prompt = `請用 "${language}" 根據 "${emailContent}" 提供一段評論，直接表達個人意見，不需過多背景敘述，適合發表在社群媒體或討論區，語氣為 "${tone}"，長度為 "${length}"。`;
                break;
            case "文章":
                prompt = `請用 "${language}" 根據 "${emailContent}" 撰寫一篇文章，並按照起承轉合的結構來安排段落，確保內容有條理並且富有說服力，語氣為 "${tone}"，長度為 "${length}"。`;
                break;
            case "想法":
                prompt = `請用 "${language}" 撰寫一段關於 "${emailContent}" 的想法，請以 "我認為" 開頭，確保內容具有個人觀點且自然流暢，語氣為 "${tone}"，長度為 "${length}"。`;
                break;
            default:
                break;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/chatgpt/", {
                message: prompt
            });

            setGeneratedContent(response.data.response || "生成失敗，請稍後重試。");
        } catch (error) {
            console.error("API 請求錯誤:", error);
            setGeneratedContent("生成失敗，請檢查伺服器連接。");
        }
    };

    // 複製 AI 生成的內容
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedContent).then(() => {
            setCopyStatus("已複製！");
            setTimeout(() => setCopyStatus("複製文本"), 2000);
        }).catch((err) => {
            console.error("複製失敗:", err);
        });
    };

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} mt="6">
            <Grid templateColumns={{ sm: "1fr", lg: "1fr 1fr" }} gap="24px">
                {/* 左側輸入區 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            信件撰寫
                        </Text>
                    </CardHeader>
                    <CardBody>
                        {/* 輸入關鍵詞 */}
                        <Textarea
                            placeholder="在這裡輸入您的關鍵詞..."
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            borderColor={borderColor}
                            mb="6"
                            minH="150px"
                        />

                        {/* 信件長度 */}
                        <Text fontWeight="bold" mb="2">信件長度</Text>
                        <ButtonGroup isAttached>
                            {["短", "中等", "長"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={length === option ? "teal" : "gray"}
                                    variant={length === option ? "solid" : "outline"}
                                    onClick={() => setLength(option)}
                                    mx="1"
                                >
                                    {option}
                                </Button>
                            ))}
                        </ButtonGroup>

                        {/* 信件格式 */}
                        <Text fontWeight="bold" mt="4" mb="2">信件格式</Text>
                        <ButtonGroup isAttached>
                            {["電子郵件", "訊息", "評論", "文章", "想法"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={format === option ? "teal" : "gray"}
                                    variant={format === option ? "solid" : "outline"}
                                    onClick={() => setFormat(option)}
                                    mx="1"
                                >
                                    {option}
                                </Button>
                            ))}
                        </ButtonGroup>

                        {/* 語氣 */}
                        <Text fontWeight="bold" mt="4" mb="2">語氣</Text>
                        <ButtonGroup isAttached>
                            {["正式", "友善", "隨意", "專業"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={tone === option ? "teal" : "gray"}
                                    variant={tone === option ? "solid" : "outline"}
                                    onClick={() => setTone(option)}
                                    mx="1"
                                >
                                    {option}
                                </Button>
                            ))}
                        </ButtonGroup>

                        {/* 輸出語言 */}
                        <Text fontWeight="bold" mt="4" mb="2">輸出語言</Text>
                        <ButtonGroup isAttached>
                            {["中文", "英文"].map((option) => (
                                <Button
                                    key={option}
                                    colorScheme={language === option ? "teal" : "gray"}
                                    variant={language === option ? "solid" : "outline"}
                                    onClick={() => setLanguage(option)}
                                    mx="1"
                                >
                                    {option}
                                </Button>
                            ))}
                        </ButtonGroup>

                        {/* 生成按鈕 */}
                        <Flex justify="flex-end" mt="6">
                            <Button colorScheme="teal" onClick={handleGenerateEmail}>
                                生成內容
                            </Button>
                        </Flex>
                    </CardBody>
                </Card>

                {/* 右側預覽區 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px" display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            內容預覽
                        </Text>
                        {/* 複製按鈕 */}
                        <Button
                            colorScheme="gray"
                            onClick={handleCopyToClipboard}
                            leftIcon={<Icon as={FiFile} />}
                        >
                            {copyStatus}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <Textarea
                            value={generatedContent}
                            borderColor={borderColor}
                            minH="400px"
                            resize="vertical"
                            overflowY="auto"
                        />
                    </CardBody>
                </Card>
            </Grid>
        </Flex>
    );
}

export default AIWrite;
