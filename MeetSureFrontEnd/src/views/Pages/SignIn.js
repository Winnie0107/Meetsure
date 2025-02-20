import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Icon,
  Link,
  Switch,
  Text,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import signInImage from "assets/img/signInImage.png";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";

function SignIn() {
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("transparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyConfirmed, setCompanyConfirmed] = useState(false);

  const companies = [
    "Tech Corp",
    "Innovate Inc",
    "Health Solutions",
    "Green Energy",
    "Education Plus",
  ];

  const flipAnimation = {
    rotateY: isFlipped ? 180 : 0,
    transition: { duration: 0.6 },
  };

  return (
    <Flex position="relative" minH="100vh" overflow="hidden">
      {/* 背景圖片容器 */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        backgroundImage={`url(${signInImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        zIndex="-1"
      />

      <Flex
        h="100vh"
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="center"
        pt={{ md: "0px" }}
      >
        <Flex
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          mt={{ base: "50px", md: "20px" }}
        >
          <motion.div
            style={{ width: "400px", height: "auto", perspective: "1000px" }}
            animate={flipAnimation}
          >
            <Flex
              direction="column"
              background="transparent"
              borderRadius="15px"
              p="30px"
              mx={{ base: "50px" }}
              m={{ base: "20px", md: "auto" }}
              bg={bgForm}
              boxShadow={useColorModeValue(
                "0px 5px 14px rgba(0, 0, 0, 0.05)",
                "unset"
              )}
            >
              {/* 翻轉的卡片外層 */}
              <motion.div
                style={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {!isFlipped ? (
                  <>
                    <Text
                      fontSize="xl"
                      color={textColor}
                      fontWeight="bold"
                      textAlign="center"
                      mb="22px"
                    >
                      登入您的MeetSure帳號
                    </Text>
                    <HStack spacing="15px" justify="center" mb="22px">
                      <Flex
                        justify="center"
                        align="center"
                        w="75px"
                        h="75px"
                        borderRadius="8px"
                        border={useColorModeValue("1px solid", "0px")}
                        borderColor="gray.200"
                        cursor="pointer"
                        transition="all .25s ease"
                        bg={bgIcons}
                        _hover={{ bg: bgIconsHover }}
                      >
                        <Link href="#">
                          <Icon as={FaFacebook} color={colorIcons} w="30px" h="30px" />
                        </Link>
                      </Flex>
                      <Flex
                        justify="center"
                        align="center"
                        w="75px"
                        h="75px"
                        borderRadius="8px"
                        border={useColorModeValue("1px solid", "0px")}
                        borderColor="gray.200"
                        cursor="pointer"
                        transition="all .25s ease"
                        bg={bgIcons}
                        _hover={{ bg: bgIconsHover }}
                      >
                        <Link href="#">
                          <Icon as={FaApple} color={colorIcons} w="30px" h="30px" />
                        </Link>
                      </Flex>
                      <Flex
                        justify="center"
                        align="center"
                        w="75px"
                        h="75px"
                        borderRadius="8px"
                        border={useColorModeValue("1px solid", "0px")}
                        borderColor="gray.200"
                        cursor="pointer"
                        transition="all .25s ease"
                        bg={bgIcons}
                        _hover={{ bg: bgIconsHover }}
                      >
                        <Link href="#">
                          <Icon as={FaGoogle} color={colorIcons} w="30px" h="30px" />
                        </Link>
                      </Flex>
                    </HStack>
                    <Text fontSize="lg" color="gray.400" fontWeight="bold" textAlign="center" mb="22px">
                      or
                    </Text>
                    <FormControl>
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        帳號名稱
                      </FormLabel>
                      <Input variant="auth" fontSize="sm" ms="4px" type="text" placeholder="Your full name" mb="24px" size="lg" />
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        密碼
                      </FormLabel>
                      <Input variant="auth" fontSize="sm" ms="4px" type="password" placeholder="Your password" mb="24px" size="lg" />
                      <FormControl display="flex" alignItems="center" mb="24px">
                        <Switch id="remember-login" colorScheme="teal" me="10px" />
                        <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
                          Remember me
                        </FormLabel>
                      </FormControl>
                      <Button fontSize="10px" variant="dark" fontWeight="bold" w="100%" h="45" mb="24px">
                        登入
                      </Button>
                      <Button
                        fontSize="10px"
                        variant="light"
                        fontWeight="bold"
                        w="100%"
                        h="45"
                        mb="24px"
                        onClick={() => setIsFlipped(true)}  // 點擊後反轉
                      >
                        公司/機構帳號登入
                      </Button>
                    </FormControl>
                  </>
                ) : (
                  <>
                    {/* 顯示公司選擇畫面 */}
                    {!companyConfirmed ? (
                      <>
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
                          <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                            請搜索並選擇您的公司/機構
                          </FormLabel>
                          <Select
                            placeholder="選擇公司"
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            mb="24px"
                            size="lg"
                            fontSize="15px"
                          >
                            {companies.map((company, index) => (
                              <option key={index} value={company}>
                                {company}
                              </option>
                            ))}
                          </Select>
                          <Button
                            fontSize="10px"
                            variant="dark"
                            fontWeight="bold"
                            w="100%"
                            h="45"
                            mb="24px"
                            onClick={() => setCompanyConfirmed(true)}  // 確認公司選擇
                            isDisabled={!selectedCompany}
                          >
                            確認選擇
                          </Button>
                          <Button
                            fontSize="10px"
                            variant="light"
                            fontWeight="bold"
                            w="100%"
                            h="45"
                            mb="24px"
                            onClick={() => setIsFlipped(false)}  // 返回個人帳號登入頁
                          >
                            返回個人帳號登入
                          </Button>
                        </FormControl>
                      </>
                    ) : (
                      // 顯示歡迎信息及帳號密碼輸入框
                      <>
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
                          <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                            請搜索並選擇您的公司/機構
                          </FormLabel>
                          <Select
                            placeholder="選擇公司"
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            mb="24px"
                            size="lg"
                            fontSize="15px"
                          >
                            {companies.map((company, index) => (
                              <option key={index} value={company}>
                                {company}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                            帳號名稱
                          </FormLabel>
                          <Input variant="auth" fontSize="sm" ms="4px" type="text" placeholder="Your full name" mb="24px" size="lg" />
                          <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                            密碼
                          </FormLabel>
                          <Input variant="auth" fontSize="sm" ms="4px" type="password" placeholder="Your password" mb="24px" size="lg" />
                          <FormControl display="flex" alignItems="center" mb="24px">
                            <Switch id="remember-login" colorScheme="teal" me="10px" />
                            <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
                              Remember me
                            </FormLabel>
                          </FormControl>
                          <Button fontSize="10px" variant="dark" fontWeight="bold" w="100%" h="45" mb="24px">
                            登入
                          </Button>
                          <Button
                            fontSize="10px"
                            variant="light"
                            fontWeight="bold"
                            w="100%"
                            h="45"
                            mb="24px"
                            onClick={() => setIsFlipped(false)}  // 返回個人帳號登入頁
                          >
                            返回個人帳號登入
                          </Button>
                        </FormControl>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            </Flex>
          </motion.div>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignIn;
