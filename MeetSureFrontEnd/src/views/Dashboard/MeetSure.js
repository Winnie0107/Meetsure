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
    Textarea,
    useToast,
} from "@chakra-ui/react";
import { FiPlus, FiMessageSquare, FiCopy, FiDownload } from "react-icons/fi";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@chakra-ui/react"; // 引入 Spinner 元件

function MeetSure({ onCancel, onSuccess, projectId }) {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const toast = useToast();

    // State to store transcript, file, and loading status
    const [transcript, setTranscript] = useState([]);
    const [copyText, setCopyText] = useState("複製文本");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 新增加載狀態
    const [aiAnalysis, setAiAnalysis] = useState(""); // 存放 AI 分析結果
    const [isAnalyzing, setIsAnalyzing] = useState(false); // AI 分析的載入狀態
    const [taskId, setTaskId] = useState(null);  // 儲存後端回傳的任務 ID
    const [progress, setProgress] = useState({ current: 0, total: 0 });  // 處理進度

    const [meetingTitle, setMeetingTitle] = useState("");
    const [meetingDatetime, setMeetingDatetime] = useState("");
    const [notes, setNotes] = useState("");




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
        setProgress({ current: 0, total: 0 });  // 重設進度
        const formData = new FormData();
        formData.append("audio", selectedFile);

        try {
            const response = await axios.post( `${process.env.REACT_APP_API_URL}/transcribe/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const id = response.data.task_id;
            console.log("✅ 取得後端 taskId：", id);
            setTaskId(id);
            pollProgress(id);  // ⏳ 開始輪詢進度

            // 等待後端最終完成轉譯結果
            if (response.data.text) {
                setTranscript([{ text: response.data.text }]);
            } else if (response.data.chunks) {
                setTranscript(response.data.chunks);
            }

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

    //前端進度顯示
    const pollProgress = (taskId) => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/progress/?task_id=${taskId}`);
                setProgress(res.data);

                if (res.data.current >= res.data.total) {
                    clearInterval(interval); // 完成後停止輪詢
                }
            } catch (err) {
                console.error("❌ 無法取得進度：", err);
                clearInterval(interval);
            }
        }, 1000);
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

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/chatgpt/`, {
                message: `
    以下是一段會議逐字稿，請幫我進行結構化分析，並以繁體中文回答。請依照以下格式輸出：
    會議記錄：
    
    1️⃣ 【會議大綱】：請摘要這段逐字稿的主要討論主題和流程。
    
    2️⃣ 【會議重點】：請列出會議中提到的關鍵資訊或決策，每點以條列方式呈現。
    
    3️⃣ 【會議中討論的問題】：列出會議中被提出來討論的具體問題或挑戰。
    
    4️⃣ 【針對問題的建議或可能解法】：如果逐字稿中有討論解法請列出，若無，請根據上下文提出建議。
    
    5️⃣ 【日期資訊】：請擷取逐字稿中出現的所有日期，並以「幾月幾日：事項說明」的格式列出。
        例如：
        - 3月26日：小組內部檢討
        - 4月3日：期中發表前準備
    
    以下是逐字稿：
    ---
    ${allText}
                `
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

    // 儲存會議記錄
    const handleSaveMeetingRecord = async () => {
        // ✏️ 表單必填驗證
        if (!meetingTitle.trim()) {
            toast({
                title: "請填寫會議名稱！",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "solid",
                colorScheme: "teal",
            });
            return;
        }

        if (!meetingDatetime) {
            toast({
                title: "請選擇會議時間！",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "solid",
                colorScheme: "teal",
            });
            return;
        }


        try {
            const userId = localStorage.getItem("user_id");
            const fullTranscript = transcript.map((e) => e.text).join("\n");
            const localDatetime = new Date(meetingDatetime);
            const utcDatetime = new Date(localDatetime.getTime() - localDatetime.getTimezoneOffset() * 60000).toISOString();

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/save-meeting-record/`, {
                title: meetingTitle,
                datetime: utcDatetime,
                transcript: fullTranscript,
                analysis: aiAnalysis,
                notes: notes,
                user_id: userId,
                project_id: projectId,
            });

            if (res.status === 201) {
                toast({
                    title: "✅ 會議紀錄已儲存！",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });

                if (onSuccess) {
                    onSuccess({
                        id: res.data.id,
                        title: meetingTitle,
                        datetime: localDatetime.toISOString(),
                        transcript: fullTranscript,
                        analysis: aiAnalysis,
                        notes,
                    });
                }

                onCancel(); // 關掉 modal
            }
        } catch (err) {
            toast({
                title: "❌ 儲存錯誤",
                description: err.response?.data?.error || err.message,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        }
    };


    return (
        <Flex direction="column" pt={{ base: "120px", md: "35px" }}>
            {/* 📌 會議基本資訊欄位 */}
            <Card mb="24px">
                <Flex mb="4" gap="4" px="4" align="center">
                    <Box flex="1">
                        <Text fontSize="xl" color={textColor} fontWeight="bold" mb="10px">
                            會議名稱
                        </Text>
                        <Input
                            placeholder="請輸入會議名稱"
                            value={meetingTitle}
                            onChange={(e) => setMeetingTitle(e.target.value)}
                        />
                    </Box>
                    <Box flex="1">
                        <Text fontSize="xl" color={textColor} fontWeight="bold" mb="10px">
                            會議時間
                        </Text>
                        <Input
                            type="datetime-local"
                            value={meetingDatetime}
                            onChange={(e) => setMeetingDatetime(e.target.value)}
                        />
                    </Box>
                </Flex>
            </Card>
            {/* Add Meeting Link Card */}
            <Grid templateColumns="1fr" gap="24px" mb="24px">
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Flex justify="space-between" alignItems="center">
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                上傳會議音檔 (接收格式：.wav)
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
                        {isLoading && (
                            <Flex alignItems="center" mt="4">
                                <Spinner size="sm" mr="2" />
                                <Text>正在處理第 {progress.current} / {progress.total} 段...</Text>
                            </Flex>
                        )}
                    </CardBody>
                </Card>
            </Grid>

            {/* Transcript Card */}
            <Grid templateColumns="1fr" gap="24px" mb="24px">
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
                                        isDisabled={!aiAnalysis}
                                    >
                                        下載.txt
                                    </Button>
                                </Stack>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Textarea
                                value={transcript.map((entry) => entry.text).join("\n")}
                                onChange={(e) => {
                                    const newText = e.target.value;
                                    setTranscript(newText.split("\n").map(line => ({ text: line })));
                                }}
                                minHeight="500px"
                                overflowY="auto"
                                whiteSpace="pre-wrap"
                                p="4"
                                border="1px solid"
                                borderColor={borderColor}
                            />

                        </CardBody>

                    </Card>
                    {/* AI Analysis Card */}
                    <Card w="50%">
                        <CardHeader p="6px 0px 28px 0px">
                            <Flex justify="space-between" alignItems="center">
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    AI分析
                                </Text>
                                <Stack direction="row" spacing={4}>
                                    <Button
                                        onClick={handleAIAnalysis}
                                        leftIcon={<FiMessageSquare />}
                                        backgroundColor="gray.200"
                                        color="black"
                                        _hover={{ bg: "gray.300" }}
                                        isLoading={isAnalyzing}
                                    >
                                        重新分析
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const blob = new Blob([`\uFEFF${aiAnalysis}`], { type: "text/plain;charset=utf-8" });
                                            const link = document.createElement("a");
                                            link.href = URL.createObjectURL(blob);
                                            link.download = "ai_analysis.txt";
                                            document.body.appendChild(link); // ⬅️ 確保在 DOM 中
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                        leftIcon={<FiDownload />}
                                        backgroundColor="gray.200"
                                        color="black"
                                        _hover={{ bg: "gray.300" }}
                                        isDisabled={!aiAnalysis}
                                    >
                                        下載.txt
                                    </Button>

                                </Stack>
                            </Flex>
                        </CardHeader>

                        <CardBody>
                            {isAnalyzing ? (
                                <Flex alignItems="center">
                                    <Spinner size="sm" mr="2" />
                                    <Text>AI 分析中，請稍候...</Text>
                                </Flex>
                            ) : (
                                <Textarea
                                    value={aiAnalysis}
                                    onChange={(e) => setAiAnalysis(e.target.value)}
                                    minHeight="500px"
                                    overflowY="auto"
                                    whiteSpace="pre-wrap"
                                    p="4"
                                    border="1px solid"
                                    borderColor={borderColor}
                                />
                            )}

                        </CardBody>
                    </Card>
                </Flex>
            </Grid>
            <Grid templateColumns="1fr" gap="24px" mb="24px">
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Flex justify="space-between" alignItems="center">
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                相關連結或資訊補充
                            </Text>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Flex mb="4" alignItems="center">
                            <Textarea
                                placeholder="請輸入您的補充內容"
                                minHeight="100px"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Flex>
                    </CardBody>
                </Card>
            </Grid>
            {/* Footer 按鈕搬進來 */}
            <Flex justify="flex-end" mt="4" px="4">
                <Button colorScheme="gray" mr={3} onClick={onCancel}>
                    取消
                </Button>
                <Button colorScheme="teal" onClick={handleSaveMeetingRecord}>
                    確認新增
                </Button>
            </Flex>

        </Flex>
    );
}

export default MeetSure;