import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useState } from "react";
import BgSignUp from "assets/img/BgSignUp.png"; // 背景圖片
import axios from "axios"; // API 請求

function SignUp() {
  const bgForm = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.700", "white");

  // 新增：使用者名稱必填
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email 格式驗證
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("請輸入有效的電子郵件地址");
      return;
    }
    // 檢查必填欄位：email, password, 確認密碼, 使用者名稱
    if (!email || !password || !confirmPassword || !name.trim()) {
      setErrorMessage("請填寫所有必填欄位");
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage("密碼長度須為8-16，且必須包含字母與數字");
      return;
    }

    // 確保密碼一致
    if (password !== confirmPassword) {
      setErrorMessage("密碼與確認密碼不一致");
      return;
    }

    try {
      // 發送註冊請求
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        email,
        password,
        acco_level: "user", // 固定為 user
        name,
      },
        { withCredentials: true } // 允許跨域請求攜帶憑證
      );
      if (response.status === 201) {
        alert("註冊成功！");
      }
    } catch (error) {
      setErrorMessage("註冊失敗，請稍後再試");
    }
  };

  // 設定與 CompanyAccountApplication 相同的背景樣式
  const bgStyle = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${BgSignUp})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Flex
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      style={bgStyle}
      p="20px"
    >
      {/* 註冊表單 */}
      <Box
        bg="white"
        p="40px"
        borderRadius="20px"
        border="1px solid #CBD5E0"
        boxShadow="0px 6px 18px rgba(0, 0, 0, 0.1)"
        w="400px"
        transition="transform 0.3s"
        _hover={{ transform: "scale(1.02)" }}
      >
        <Text fontSize="xl" color="teal.500" fontWeight="bold" textAlign="center" mb="22px">
          註冊帳號 - 個人用戶
        </Text>

        <FormControl isInvalid={errorMessage}>
          <FormLabel fontSize="sm" color="gray.700">
            使用者名稱
          </FormLabel>
          <Input
            fontSize="16px"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="請輸入使用者名稱"
            mb="20px"
            size="lg"
          />
          <FormLabel fontSize="sm" color="gray.700">
            Email
          </FormLabel>
          <Input
            fontSize="16px"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請輸入您的電子郵件"
            mb="20px"
            size="lg"
          />
          <FormLabel fontSize="sm" color="gray.700">
            密碼
          </FormLabel>
          <Input
            fontSize="sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼長度須為8到16之間，且必須包含字母與數字"
            mb="20px"
            size="lg"
          />
          <FormLabel fontSize="sm" color="gray.700">
            確認密碼
          </FormLabel>
          <Input
            fontSize="sm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="請再次輸入密碼"
            size="lg"
          />
          {errorMessage && (
            <FormErrorMessage mt="10px">{errorMessage}</FormErrorMessage>
          )}

          <Button
            fontSize="md"
            fontWeight="bold"
            w="100%"
            h="45px"
            mt="30px"
            mb="24px"
            bg="teal.500"
            color="white"
            _hover={{ bg: "teal.600" }}
            onClick={handleSubmit}
          >
            註冊
          </Button>
        </FormControl>

        <Flex flexDirection="column" justifyContent="center" alignItems="center" maxW="100%">
          <Text color={textColor} fontWeight="medium">
            已經有帳號？
            <Text
              color="teal.500"
              as="span"
              ms="5px"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => (window.location.href = "http://localhost:3000/#/auth/signin")}
            >
              點此登入
            </Text>

          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}

export default SignUp;