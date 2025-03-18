import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import BgSignUp from "assets/img/BgSignUp.png";

function SignIn() {
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

      if (response.data.success) {
        
        // 🔥 存儲 email
        localStorage.setItem("token", response.data.token);  

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
          請登入您的 MeetSure 帳號
        </Text>
      </Flex>

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
          <Text fontSize="2xl" color="black" fontWeight="bold" textAlign="center" mb="22px">
            請輸入以下資料
          </Text>

          <FormControl mb="24px">
            <FormLabel>Gmail</FormLabel>
            <Input
              type="text"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl mb="24px">
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
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignIn;