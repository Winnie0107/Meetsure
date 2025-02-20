import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Select,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaUser, FaBuilding, FaArrowLeft } from "react-icons/fa"; // 使用 FaUser, FaBuilding 和 FaArrowLeft
import React, { useState } from "react";
import BgSignUp from "assets/img/BgSignUp.png"; // 背景圖片
import axios from "axios"; // 用於發送請求

function SignUp() {
  const [userType, setUserType] = useState(null); // 用來控制選擇的用戶類型
  const [company, setCompany] = useState(""); // 用來控制選擇的公司
  const bgForm = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.700", "white");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("transparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // 重設用戶類型的函數
  const resetUserType = () => setUserType(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email 格式驗證
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("請輸入有效的電子郵件地址");
      return;
    }

    // 表單驗證
    if (!email || !password || !confirmPassword) {
      setErrorMessage("請填寫所有欄位");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage("密碼格式不符合要求");
      return;
    }

    // 密碼和確認密碼是否相同
    if (password !== confirmPassword) {
      setErrorMessage("密碼與確認密碼不一致");
      return;
    }

    try {
      // 向 Django 後端發送註冊請求
      const response = await axios.post("http://localhost:8000/api/register", {
        email,
        password,
        acco_level: "user", // 默認為 user
        company: userType === "company" ? company : null,
      },
        {
          withCredentials: true,  // 确保允许跨域携带凭证
        }
      );
      if (response.status === 201) {
        // 註冊成功，跳轉或顯示成功訊息
        alert("註冊成功！");
      }
    } catch (error) {
      setErrorMessage("註冊失敗，請稍後再試");
    }
  };

  // 公司選項列表（可以從 API 或數據庫獲取）
  const companyOptions = [
    { value: "company1", label: "Tech Corp" },
    { value: "company2", label: "Innovate Inc" },
    { value: "company3", label: "Green Energy" },
  ];



  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden">
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        maxH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        maxW={{ md: "calc(100vw - 50px)" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
        borderRadius={{ base: "0px", md: "20px" }}>
        <Box w="100vw" h="100vh" opacity="0.8"></Box>
      </Box>

      <Flex direction="column" textAlign="center" justifyContent="center" align="center" mt="125px" mb="30px">
        <Text fontSize="4xl" color="white" fontWeight="bold">
          Hello！歡迎成為MeetSure的會員
        </Text>
      </Flex>

      {/* 身分選擇區域 */}
      {!userType && (
        <Flex justify="center" mb="40px">
          <Box
            p="40px"
            borderRadius="15px"
            w="445px"
            background="transparent"
            bg={bgForm}
            boxShadow="0px 5px 14px rgba(0, 0, 0, 0.05)"
            textAlign="center">
            <Text fontSize="2xl" color="black" fontWeight="bold" mb="15px">
              我想要在MeetSure
            </Text>
            <Text fontSize="2xl" color="black" fontWeight="bold" mb="40px">
              註冊的身分為
            </Text>
            <Text fontSize="15px" color="black" mb="50px">
              請正確選擇您的身分，註冊公司帳號需經過管理員審核
            </Text>
            <HStack spacing="80px" justify="center" mb="50px">
              {/* 個人用戶選擇按鈕 */}
              <Flex
                direction="column"
                justify="center"
                align="center"
                w="100px"
                h="100px"
                borderRadius="8px"
                border="1px solid"
                borderColor="gray.200"
                cursor="pointer"
                bg={bgIcons}
                _hover={{ bg: bgIconsHover }}
                onClick={() => setUserType("personal")}>
                <Icon as={FaUser} color={colorIcons} w="40px" h="40px" />
                <Text fontSize="xl" color="black" mt="8px">個人用戶</Text>
              </Flex>

              {/* 公司用戶選擇按鈕 */}
              <Flex
                direction="column"
                justify="center"
                align="center"
                w="100px"
                h="100px"
                borderRadius="8px"
                border="1px solid"
                borderColor="gray.200"
                cursor="pointer"
                bg={bgIcons}
                _hover={{ bg: bgIconsHover }}
                onClick={() => setUserType("company")}>
                <Icon as={FaBuilding} color={colorIcons} w="40px" h="40px" />
                <Text fontSize="xl" color="black" mt="8px">公司用戶</Text>
              </Flex>
            </HStack>
          </Box>
        </Flex>
      )}

      {/* 根據選擇的身份顯示註冊表單 */}
      {userType && (
        <Flex alignItems="center" justifyContent="center" mb="60px">
          <Flex
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p="40px"
            mx={{ base: "100px" }}
            bg={bgForm}
            boxShadow="0px 5px 14px rgba(0, 0, 0, 0.05)">
            {/* 返回鍵區域 */}
            <Flex alignItems="center" mb="20px" cursor="pointer" onClick={resetUserType}>
              <Icon as={FaArrowLeft} color={textColor} w="20px" h="20px" />
              <Text fontSize="md" color={textColor} ml="5px">
                返回選擇
              </Text>
            </Flex>
            <Text fontSize="xl" color={textColor} fontWeight="bold" textAlign="center" mb="22px">
              註冊帳號 - {userType === "personal" ? "個人用戶" : "公司用戶"}
            </Text>
            <FormControl isInvalid={errorMessage}>
              {userType === "company" && (
                <>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    選擇公司
                  </FormLabel>
                  <Select
                    placeholder="選擇您的公司"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    mb="24px"
                    size="lg"
                    fontSize="16px">
                    {companyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </>
              )}
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Email
              </FormLabel>
              <Input
                variant="auth"
                fontSize="16px"
                ms="4px"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                mb="24px"
                size="lg"
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                密碼
              </FormLabel>
              <Input variant="auth"
                fontSize="sm"
                ms="4px"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密碼長度須為8到16之間, 而且必須包含字母,數字"
                mb="24px"
                size="lg" />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                確認密碼
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                ms="4px"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Please enter password again" size="lg"
              />
              {errorMessage && (
                <Flex justify="flex-end">
                  <FormErrorMessage>{errorMessage}</FormErrorMessage>
                </Flex>
              )}
              <Button
                fontSize="10px"
                variant="dark"
                fontWeight="bold"
                w="100%" h="45"
                mt="30px"
                mb="24px"
                onClick={handleSubmit}
              >
                註冊
              </Button>
            </FormControl>
            <Flex flexDirection="column" justifyContent="center" alignItems="center" maxW="100%" mt="0px">
              <Text color={textColor} fontWeight="medium">
                已經有帳號？
                <Link color={textColor} as="span" ms="5px" href="#" fontWeight="bold">
                  點此登入
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

export default SignUp;
