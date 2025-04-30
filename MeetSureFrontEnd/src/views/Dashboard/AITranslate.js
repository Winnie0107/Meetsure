import React, { useState } from "react";
import {
    Flex,
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
} from "@chakra-ui/react";
import { FiFile, FiChevronDown } from "react-icons/fi";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";

function AITranslate() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // State for user input and translation settings
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("英文");
    const [copyStatus, setCopyStatus] = useState("複製文本");
    const [loading, setLoading] = useState(false);

    // 支援的語言選項
    const languageOptions = ["日文", "韓文", "西班牙文", "法文", "德文", "義大利文"];

    // 發送請求給 GPT 進行翻譯
    const translateText = async () => {
        if (!inputText.trim()) return;  // 防止空內容發送請求
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/chatgpt/`, {
                message: `請幫我將這段話翻譯成${targetLanguage}：「${inputText}」`
            });

            setTranslatedText(response.data.response);
        } catch (error) {
            console.error("翻譯失敗", error);
            setTranslatedText("翻譯失敗，請稍後再試。");
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
        <Flex direction="row" pt={{ base: "120px", md: "75px" }} gap="24px" mt="6">
            {/* 左邊的翻譯輸入區域 */}
            <Card w="50%">
                <CardHeader p="6px 0px 22px 0px">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        AI翻譯 - 輸入
                    </Text>
                </CardHeader>
                <CardBody>
                    {/* 來源語言固定為「自動偵測」 */}
                    <Button colorScheme="teal" borderRadius="8px" mb="4">
                        自動偵測語言
                    </Button>

                    {/* 輸入文字框 */}
                    <Textarea
                        placeholder="在這裡輸入要翻譯的內容..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        borderColor={borderColor}
                        mb="6"
                        minH="350px"
                    />

                    {/* 翻譯按鈕 */}
                    <Flex justify="flex-end">
                        <Button colorScheme="teal" onClick={translateText} isLoading={loading}>
                            翻譯
                        </Button>
                    </Flex>
                </CardBody>
            </Card>

            {/* 右邊的翻譯結果區域 */}
            <Card w="50%">
                <CardHeader p="6px 0px 22px 0px">
                    <Flex justify="space-between" alignItems="center">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            AI翻譯 - 結果
                        </Text>
                        {/* 複製按鈕 */}
                        <Button colorScheme="gray" onClick={handleCopyToClipboard} leftIcon={<Icon as={FiFile} />} borderRadius="8px">
                            {copyStatus}
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody>
                    {/* 目標語言選擇 (不改變原有 UI) */}
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
                        {/* 下拉選單選擇其他語言 */}
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<Icon as={FiChevronDown} />}
                                colorScheme="gray"
                                borderRadius="0 8px 8px 0"
                            >
                                更多語言
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

                    {/* 翻譯結果顯示 */}
                    <Textarea
                        value={translatedText}
                        borderColor={borderColor}
                        minH="340px"
                        overflowY="auto"
                    />
                </CardBody>
            </Card>
        </Flex>
    );
}

export default AITranslate;
