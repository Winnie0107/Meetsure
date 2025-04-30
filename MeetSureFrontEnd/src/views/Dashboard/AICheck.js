import {
    Flex,
    Grid,
    Text,
    Textarea,
    Button,
    Stack,
    Icon,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiFile, FiChevronDown } from "react-icons/fi";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";

function AICheck() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const [inputText, setInputText] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [copyStatus, setCopyStatus] = useState("複製文本");
    const [targetLanguage, setTargetLanguage] = useState("英文");
    const [mode, setMode] = useState("標準"); // 預設檢查模式
    const [loading, setLoading] = useState(false);

    // 檢查模式選項
    const modeOptions = [
        { label: "簡易", tooltip: "檢查基礎文法及拼字，不更動文本內容" },
        { label: "標準", tooltip: "基本語法檢查並適當調整詞彙更換語氣" },
        { label: "進階", tooltip: "將重組句意、調整文本結構" },
    ];

    // 目標語言選擇
    const languageOptions = ["日文", "韓文", "西班牙文", "法文", "德文"];

    // 發送 API 請求
    const checkGrammar = async () => {
        if (!inputText.trim()) return;
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/chatgpt/`, {
                message: `請幫我檢查這段文本的語法，並根據"${mode}"模式提供建議：「${inputText}」`
            });

            setSuggestions(response.data.response);
        } catch (error) {
            console.error("檢查失敗", error);
            setSuggestions("檢查失敗，請稍後再試。");
        } finally {
            setLoading(false);
        }
    };

    // 複製結果
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(suggestions).then(() => {
            setCopyStatus("已複製！");
            setTimeout(() => setCopyStatus("複製文本"), 2000);
        }, (err) => {
            console.error("複製失敗:", err);
        });
    };

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} mt="6">
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                {/* 輸入區域 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            語法檢查 - 輸入
                        </Text>
                    </CardHeader>
                    <CardBody>
                        {/* 語言選擇 */}
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
                            <Menu>
                                <MenuButton as={Button} rightIcon={<Icon as={FiChevronDown} />} colorScheme="gray" borderRadius="0 8px 8px 0">
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

                        {/* 輸入文本框 */}
                        <Textarea
                            placeholder="在這裡輸入要檢查的文本..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            borderColor={borderColor}
                            minH="280px"
                            mb="4"
                        />

                        {/* 檢查模式選擇 */}
                        <Text fontWeight="bold" mb="2">選擇檢查模式</Text>
                        <Stack direction="row" spacing="3" mb="4">
                            {modeOptions.map((option) => (
                                <Tooltip label={option.tooltip} fontSize="md" key={option.label} bg="teal.500" color="white" borderRadius="md" boxShadow="lg" placement="bottom" p="2">
                                    <Button
                                        variant={mode === option.label ? "solid" : "outline"}
                                        colorScheme="teal"
                                        onClick={() => setMode(option.label)}
                                    >
                                        {option.label}
                                    </Button>
                                </Tooltip>
                            ))}
                        </Stack>

                        {/* 檢查語法按鈕 */}
                        <Flex justifyContent="flex-end">
                            <Button colorScheme="teal" onClick={checkGrammar} isLoading={loading}>
                                檢查語法
                            </Button>
                        </Flex>
                    </CardBody>
                </Card>

                {/* 結果區域 */}
                <Card>
                    <CardHeader p="6px 0px 22px 0px" display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            語法檢查 - 結果
                        </Text>
                        <Button colorScheme="gray" onClick={handleCopyToClipboard} leftIcon={<Icon as={FiFile} />}>
                            {copyStatus}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <Textarea
                            value={suggestions}
                            borderColor={borderColor}
                            minH="350px"
                            overflowY="auto"
                        />
                    </CardBody>
                </Card>
            </Grid>
        </Flex>
    );
}

export default AICheck;
