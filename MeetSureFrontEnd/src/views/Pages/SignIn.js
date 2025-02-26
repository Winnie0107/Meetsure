import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

function SignIn() {
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🚀 發送 API 請求到 Django 伺服器
  const handleLogin = async () => {
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

      if (response.data.success) {
        
        // 🔥 存儲 email
        localStorage.setItem("user_email", response.data.email); 
        localStorage.setItem("user_id", response.data.user_id);

        // ✅ 直接使用 window.location.href 進行跳轉
        window.location.href = response.data.redirect_url;
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("登入失敗，請檢查您的帳號和密碼");
    }
  };

  return (
    <Flex position="relative" minH="100vh" overflow="hidden">
      <Flex h="100vh" w="100%" maxW="1044px" mx="auto" justifyContent="center" align="center">
        <Box w="400px" bg={bgForm} borderRadius="15px" p="30px" boxShadow="lg">
          <Text fontSize="xl" color={textColor} fontWeight="bold" textAlign="center" mb="22px">
            登入您的 MeetSure 帳號
          </Text>

          <FormControl>
            <FormLabel>Gmail</FormLabel>
            <Input
              type="text"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl mt="4">
            <FormLabel>密碼</FormLabel>
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          {errorMessage && (
            <Text color="red.500" mt="4" textAlign="center">
              {errorMessage}
            </Text>
          )}

          <Button colorScheme="blue" w="100%" mt="6" onClick={handleLogin}>
            登入
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
