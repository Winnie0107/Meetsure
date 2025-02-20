import React, { useState } from "react";
import {
    Flex,
    Button,
    Box,
    Image,
    Text,
    VStack,
    Icon,
    FormControl,
    FormLabel,
    Input,
    Select,
    Switch,
} from "@chakra-ui/react";
import { FaUserCog, FaBuilding } from "react-icons/fa"; // 使用 react-icons 的圖示
import MeetSureLogo from "assets/img/MeetSureLogo.png";
import axios from "axios";

function AdminSignIn() {
    const bgColor = "#1E293B"; // 固定背景純色
    const cardBg = "linear-gradient(135deg, #E2E8F0 0%, #F7FAFC 100%)"; // 使用漸變背景
    const textColor = "teal.500"; // 文字顏色
    const buttonColor = "teal.500"; // 按鈕顏色（更深的色調）
    const hoverButtonColor = "teal.600"; // hover 狀態顏色（更深的色調）
    const deepButtonColor = "teal.900"; // 更深的顏色，讓按鈕更突出

    const [currentStep, setCurrentStep] = useState("selectRole");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // 用於顯示錯誤訊息

    const companies = [
        "Tech Corp",
        "Innovate Inc",
        "Health Solutions",
        "Green Energy",
        "Education Plus",
    ];
    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("請填寫電子郵件和密碼");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });

            const data = response.data;

            // 根據後端返回的角色跳轉
            if (data.role === "system_admin" || data.role === "company_admin") {
                localStorage.setItem("user_id", data.user_id); // 儲存使用者 ID
                localStorage.setItem("role", data.role); // 儲存角色
                window.location.href = data.redirect_url; // 跳轉
            }

        } catch (error) {
            // 處理錯誤：如果後端返回錯誤，`error.response` 會包含詳細訊息
            if (error.response) {
                setErrorMessage(error.response.data.error || "登入失敗");
            } else {
                setErrorMessage("發生未知錯誤");
            }
        }
    };


    const renderLogo = () => (
        <Image
            src={MeetSureLogo}
            alt="MeetSure Logo"
            w="120px"
            mx="auto"
            mb="20px"
        />
    );

    return (
        <Flex
            minH="100vh"
            justifyContent="center"
            alignItems="center"
            bg={bgColor}
            p="20px"
        >
            <Box
                bg={cardBg}
                p="40px"
                borderRadius="20px"
                border="1px solid #CBD5E0"
                boxShadow="0px 6px 18px rgba(0, 0, 0, 0.1)" // 增加陰影效果
                w="400px"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.02)" }}
            >
                {/* 選擇身份 */}
                {currentStep === "selectRole" && (
                    <>
                        {renderLogo()}
                        <Text
                            fontSize="xl"
                            color={textColor}
                            fontWeight="bold"
                            textAlign="center"
                            mb="22px"
                        >
                            選擇您的身份
                        </Text>
                        <VStack spacing="20px">
                            {/* 系統管理員 */}
                            <Button
                                w="100%"
                                h="100px"
                                bg="#ffffff"
                                color="gray.700"
                                border="1px solid #E2E8F0"
                                borderRadius="12px"
                                _hover={{
                                    bg: "gray.200",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                    transform: "scale(1.05)",
                                    transition: "all 0.3s ease",
                                }}
                                onClick={() => setCurrentStep("systemAdminLogin")}
                            >
                                <VStack>
                                    <Icon as={FaUserCog} w="30px" h="30px" />
                                    <Text fontSize="lg" fontWeight="bold">
                                        系統管理員
                                    </Text>
                                </VStack>
                            </Button>

                            {/* 公司管理員 */}
                            <Button
                                w="100%"
                                h="100px"
                                bg="#ffffff"
                                color="gray.700"
                                border="1px solid #E2E8F0"
                                borderRadius="12px"
                                _hover={{
                                    bg: "gray.200",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                    transform: "scale(1.05)",
                                    transition: "all 0.3s ease",
                                }}
                                onClick={() => setCurrentStep("selectCompany")}
                            >
                                <VStack>
                                    <Icon as={FaBuilding} w="30px" h="30px" />
                                    <Text fontSize="lg" fontWeight="bold">
                                        公司管理員
                                    </Text>
                                </VStack>
                            </Button>
                        </VStack>
                    </>
                )}

                {/* 系統管理員登入 */}
                {currentStep === "systemAdminLogin" && (
                    <>
                        {renderLogo()}
                        <Text
                            fontSize="xl"
                            color={textColor}
                            fontWeight="bold"
                            textAlign="center"
                            mb="22px"
                        >
                            系統管理員登入
                        </Text>
                        {/* 顯示錯誤訊息 */}
                        {errorMessage && (
                            <Text color="red.500" fontSize="sm" mb="16px">
                                {errorMessage}
                            </Text>
                        )}

                        <FormControl>
                            <FormLabel fontSize="sm" color="gray.700">
                                Email
                            </FormLabel>
                            <Input
                                type="email"
                                placeholder="Your email address"
                                mb="24px"
                                size="lg"
                                bg="gray.100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // 更新 email
                            />
                            <FormLabel fontSize="sm" color="gray.700">
                                密碼
                            </FormLabel>
                            <Input
                                type="password"
                                placeholder="Your password"
                                mb="24px"
                                size="lg"
                                bg="gray.100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // 更新 password
                            />
                            <FormControl display="flex" alignItems="center" mb="24px">
                                <Switch colorScheme="blue" mr="10px" />
                                <FormLabel mb="0" color="gray.700">
                                    記住我
                                </FormLabel>
                            </FormControl>

                            <Button
                                w="100%"
                                h="45px"
                                mb="24px"
                                bg={buttonColor}
                                color="white"
                                _hover={{ bg: hoverButtonColor }}
                                onClick={handleLogin} // 直接呼叫 handleLogin 函式，不需要傳入參數

                            >
                                登入
                            </Button>
                            <Button
                                w="100%"
                                h="45px"
                                bg="gray.600"
                                color="white"
                                _hover={{ bg: "gray.500" }}
                                onClick={() => setCurrentStep("selectRole")}
                            >
                                返回身份選擇
                            </Button>
                        </FormControl>
                    </>
                )}

                {/* 公司選擇 */}
                {currentStep === "selectCompany" && (
                    <>
                        {renderLogo()}
                        <Text
                            fontSize="xl"
                            color={textColor}
                            fontWeight="bold"
                            textAlign="center"
                            mb="22px"
                        >
                            選擇公司
                        </Text>
                        <FormControl>
                            <FormLabel fontSize="sm" color="gray.700">
                                請選擇您的公司/機構
                            </FormLabel>
                            <Select
                                placeholder="選擇公司"
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                mb="24px"
                                size="lg"
                                bg="gray.100"
                            >
                                {companies.map((company, index) => (
                                    <option key={index} value={company}>
                                        {company}
                                    </option>
                                ))}
                            </Select>
                            <Button
                                w="100%"
                                h="45px"
                                bg={buttonColor}
                                color="white"
                                _hover={{ bg: hoverButtonColor }}
                                mb="24px"
                                onClick={() => setCurrentStep("companyAdminLogin")}
                                isDisabled={!selectedCompany}
                            >
                                確認選擇
                            </Button>
                            <Button
                                w="100%"
                                h="45px"
                                bg="gray.600"
                                color="white"
                                _hover={{ bg: "gray.500" }}
                                onClick={() => setCurrentStep("selectRole")}
                            >
                                返回身份選擇
                            </Button>
                        </FormControl>
                    </>
                )}

                {/* 公司管理員登入 */}
                {currentStep === "companyAdminLogin" && (
                    <>
                        {renderLogo()}
                        <Text
                            fontSize="xl"
                            color={textColor}
                            fontWeight="bold"
                            textAlign="center"
                            mb="22px"
                        >
                            歡迎! {selectedCompany}
                        </Text>
                        <FormControl>
                            <FormLabel fontSize="sm" color="gray.700">
                                Email
                            </FormLabel>
                            <Input
                                type="email"
                                placeholder="Your email address"
                                mb="24px"
                                size="lg"
                                bg="gray.100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // 更新 email
                            />
                            <FormLabel fontSize="sm" color="gray.700">
                                密碼
                            </FormLabel>
                            <Input
                                type="password"
                                placeholder="Your password"
                                mb="24px"
                                size="lg"
                                bg="gray.100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // 更新 password
                            />
                            <Button
                                w="100%"
                                h="45px"
                                bg={buttonColor} // 使用更深的顏色
                                color="white"
                                _hover={{ bg: hoverButtonColor }} // 更深的 hover 顏色
                                mb="24px"
                                onClick={handleLogin} // 直接呼叫 handleLogin 函式，不需要傳入參數

                            >
                                登入
                            </Button>
                            <Button
                                w="100%"
                                h="45px"
                                bg="gray.600"
                                color="white"
                                _hover={{ bg: "gray.500" }}
                                onClick={() => setCurrentStep("selectCompany")}
                            >
                                返回公司選擇
                            </Button>
                        </FormControl>
                    </>
                )}
            </Box>
        </Flex>
    );
}

export default AdminSignIn;
