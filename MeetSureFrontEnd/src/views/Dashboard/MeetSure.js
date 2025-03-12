import {
    Flex,
    Grid,
    Text,
    Button,
    Stack,
    Icon,
    useColorModeValue,
    Box,
    Input,
} from "@chakra-ui/react";
import { FiPlus, FiMessageSquare, FiCopy, FiDownload } from "react-icons/fi";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@chakra-ui/react"; // 引入 Spinner 元件

function MeetSure() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // State to store transcript, file, and loading status
    const [transcript, setTranscript] = useState([]);
    const [copyText, setCopyText] = useState("複製文本");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 新增加載狀態
    const [aiAnalysis, setAiAnalysis] = useState(""); // 存放 AI 分析結果
    const [isAnalyzing, setIsAnalyzing] = useState(false); // AI 分析的載入狀態

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Handle file upload and transcription
    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert("請選擇一個音檔");
            return;
        }

        setIsLoading(true); // 設置為加載中
        const formData = new FormData();
        formData.append("audio", selectedFile);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/transcribe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("後端響應數據:", response.data); // 打印後端返回的完整數據
            if (response.data.chunks) {
                setTranscript(response.data.chunks);
            } else if (response.data.text) {
                // 如果後端只返回一個完整文字
                setTranscript([{ text: response.data.text, timestamp: [] }]);
            } else {
                alert("後端返回格式不正確");
            }
        } catch (error) {
            console.error("文件上傳失敗:", error);
            alert("文件上傳失敗: " + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false); // 結束加載狀態
        }
    };

    // Copy transcript text
    const handleCopy = () => {
        const allText = transcript.map(entry => `${entry.text}`).join("\n");
        navigator.clipboard.writeText(allText);
        setCopyText("已複製！");
        setTimeout(() => setCopyText("複製文本"), 2000);
    };

    // Download transcript as .txt
    const handleDownload = () => {
        const allText = transcript.map(entry => `${entry.text}`).join("\n");
        const blob = new Blob([allText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transcript.txt";
        link.click();
    };

    // AI 內容分析
    const handleAIAnalysis = async () => {
        if (transcript.length === 0) {
            console.error("❌ AI 分析失敗：逐字稿內容為空");
            setAiAnalysis("AI 分析失敗：逐字稿內容為空");
            return;
        }

        setIsAnalyzing(true);
        const allText = transcript.map(entry => entry.text).join("\n");

        try {
            console.log("📤 發送至 AI API:", allText); // 🛠️ 確保有內容送出

            const response = await axios.post("http://127.0.0.1:8000/chatgpt/", {
                message: `請幫我分析這段文字，並用中文分別回應這段文字的大綱跟重點：
            
            「${allText}」`
            });

            console.log("✅ AI API 回應:", response.data);

            if (response.data.response) {
                setAiAnalysis(response.data.response);
            } else if (response.data.error) {
                setAiAnalysis("AI 回應錯誤：" + response.data.error);
            } else {
                setAiAnalysis("AI 無回應，請稍後重試。");
            }
        } catch (error) {
            console.error("❌ AI 分析請求失敗:", error);
            setAiAnalysis("AI 分析失敗：" + (error.response?.data?.error || error.message));
        } finally {
            setIsAnalyzing(false);
        }
    };


    // 監聽 transcript 變化，自動觸發 AI 分析
    useEffect(() => {
        if (transcript.length > 0) {
            handleAIAnalysis();
        }
    }, [transcript]);

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            {/* Add Meeting Link Card */}
            <Grid templateColumns="1fr" gap="24px" mb="24px">
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Flex justify="space-between" alignItems="center">
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                新增會議影音連接
                            </Text>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Flex mb="4" alignItems="center">
                            <Input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileChange}
                                flex="1"
                                mr="4"
                            />
                            <Button
                                colorScheme="teal"
                                size="md"
                                onClick={handleFileUpload}
                                ml="auto"
                                isLoading={isLoading} // 按鈕顯示加載狀態
                                isDisabled={isLoading} // 加載時禁用按鈕
                            >
                                {isLoading ? "轉換中..." : "上傳並轉錄"}
                            </Button>
                        </Flex>
                        {isLoading && ( // 加載時顯示 Spinner
                            <Flex alignItems="center" mt="4">
                                <Spinner size="sm" mr="2" />
                                <Text>正在處理，請稍候...</Text>
                            </Flex>
                        )}
                    </CardBody>
                </Card>
            </Grid>

            {/* Transcript Card */}
            <Grid templateColumns="1fr" gap="24px">
                <Flex direction="row" gap="24px">
                    <Card w="50%">
                        <CardHeader p="6px 0px 22px 0px">
                            <Flex justify="space-between" alignItems="center">
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    逐字稿
                                </Text>
                                <Stack direction="row" spacing={4}>
                                    <Button
                                        onClick={handleCopy}
                                        leftIcon={<Icon as={FiCopy} />}
                                        backgroundColor="gray.200"
                                        color="black"
                                        _hover={{ bg: "gray.300" }}
                                        variant="solid"
                                    >
                                        {copyText}
                                    </Button>
                                    <Button
                                        onClick={handleDownload}
                                        leftIcon={<Icon as={FiDownload} />}
                                        backgroundColor="gray.200"
                                        color="black"
                                        _hover={{ bg: "gray.300" }}
                                        variant="solid"
                                    >
                                        下載.txt
                                    </Button>
                                </Stack>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Box
                                maxH="500px"
                                overflowY="auto"
                                border="1px solid"
                                borderColor={borderColor}
                                p="4"
                                whiteSpace="pre-wrap" // 確保換行符生效
                            >
                                {transcript.length > 0 ? (
                                    <Text>
                                        {transcript.map((entry) => entry.text).join("\n")}

                                    </Text>
                                ) : (
                                    <Text>目前沒有轉錄內容</Text>
                                )}
                            </Box>
                        </CardBody>

                    </Card>
                    {/* AI Analysis Card */}
                    <Card w="50%">
                        <CardHeader p="6px 0px 28px 0px">
                            <Flex justify="space-between" alignItems="center">
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    AI分析
                                </Text>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Box maxH="500px" overflowY="auto" border="1px solid" borderColor={borderColor} p="4" whiteSpace="pre-wrap">
                                {isAnalyzing ? (
                                    <Flex alignItems="center">
                                        <Spinner size="sm" mr="2" />
                                        <Text>AI 分析中，請稍候...</Text>
                                    </Flex>
                                ) : (
                                    <Text>{aiAnalysis || "尚無 AI 分析結果"}</Text>
                                )}
                            </Box>
                        </CardBody>
                    </Card>
                </Flex>
            </Grid>
        </Flex>
    );
}

export default MeetSure;