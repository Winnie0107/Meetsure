// Chakra imports
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Image,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Custom components

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import IconBox from "components/Icons/IconBox";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
  ChatIcon,
  PenIcon
} from "components/Icons/Icons.js";
import { CheckIcon } from '@chakra-ui/icons';

// Variables
import {
  barChartData,
  barChartOptions,
  lineChartData,
  lineChartOptions,
} from "variables/charts";
import { pageVisits, socialTraffic } from "variables/general";

// Assets
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
import avatar6 from "assets/img/avatars/avatar6.png";
import ImageArchitect1 from "assets/img/ImageArchitect1.png";
import ImageArchitect2 from "assets/img/ImageArchitect2.png";
import ImageArchitect3 from "assets/img/ImageArchitect3.png";

import {
  FaPlus,
} from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import RightPanelWithCalendar from './RightPanelWithCalendar';
import axios from "axios";



export default function Dashboard() {
  // Chakra Color Mode
  const iconteal = useColorModeValue("teal.500", "teal.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");

  const { colorMode } = useColorMode();


  // 新增的邏輯狀態和處理函數
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newMeeting, setNewMeeting] = useState({ date: "", time: "", description: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting({ ...newMeeting, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // 確保 date 和 time 已輸入
      if (!newMeeting.date || !newMeeting.time || !newMeeting.description) {
        alert("All fields are required.");
        return;
      }
  
      // 格式化 datetime
      const datetime = `${newMeeting.date} ${newMeeting.time}`;
      await axios.post("http://127.0.0.1:8000/api/meetings/add", {
        datetime,
        description: newMeeting.description,
      });
  
      alert("Meeting added successfully!");
      setNewMeeting({ date: "", time: "", description: "" });
      onClose();
    } catch (error) {
      console.error("Error adding meeting:", error.response?.data || error);
      alert("Failed to add meeting.");
    }
  };
  


  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px' mb='20px'>
        <Card
          as='a'
          href='http://localhost:3000/argon-dashboard-chakra#/admin/aiwrite' // 點擊後跳轉的 URL
          minH='125px'
          _hover={{ bg: "teal.100", transform: "scale(1.05)", transition: "0.3s" }} // 鼠標懸停樣式
          cursor='pointer' // 鼠標懸停時變成手形
        >
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'
              mb='25px'>
              <Stat me='auto'>
                <Flex>
                  <StatNumber fontSize='2xl' color={textColor} fontWeight='900'>
                    智能寫作
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius='50%'
                as='box'
                h={"45px"}
                w={"45px"}
                bg={iconteal}>
                <PenIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
            <Text color='gray.400' fontSize='sm'>自動撰寫信件</Text>
          </Flex>
        </Card>

        <Card
          as='a'
          href='http://localhost:3000/argon-dashboard-chakra#/admin/aichat' // 點擊後跳轉的 URL
          minH='125px'
          _hover={{ bg: "teal.100", transform: "scale(1.05)", transition: "0.3s" }} // 鼠標懸停樣式
          cursor='pointer' // 鼠標懸停時變成手形
        >
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'
              mb='25px'>
              <Stat me='auto'>
                <Flex>
                  <StatNumber fontSize='2xl' color={textColor} fontWeight='900'>
                    ChatRoom
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius="50%"
                as="box"
                h="45px"
                w="45px"
                bg={iconteal}
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative">
                <ChatIcon
                  h="24px"
                  w="24px"
                  color={iconBoxInside}
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                />
              </IconBox>


            </Flex>
            <Text color='gray.400' fontSize='sm'>
              ChatGPT
            </Text>
          </Flex>
        </Card>


        <Card
          as='a'
          href='http://localhost:3000/argon-dashboard-chakra#/admin/aitranslate' // 點擊後跳轉的 URL
          minH='125px'
          _hover={{ bg: "teal.100", transform: "scale(1.05)", transition: "0.3s" }} // 鼠標懸停樣式
          cursor='pointer' // 鼠標懸停時變成手形
        >
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'
              mb='25px'>
              <Stat me='auto'>
                <Flex>
                  <StatNumber fontSize='2xl' color={textColor} fontWeight='900'>
                    自動翻譯
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius='50%'
                as='box'
                h={"45px"}
                w={"45px"}
                bg={iconteal}>
                <GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
            <Text color='gray.400' fontSize='sm'>多國語言翻譯</Text>
          </Flex>
        </Card>

        <Card
          as='a'
          href='http://localhost:3000/argon-dashboard-chakra#/admin/aicheck' // 點擊後跳轉的 URL
          minH='125px'
          _hover={{ bg: "teal.100", transform: "scale(1.05)", transition: "0.3s" }} // 鼠標懸停樣式
          cursor='pointer' // 鼠標懸停時變成手形
        >  <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'
              mb='25px'>
              <Stat me='auto'>
                <Flex>
                  <StatNumber fontSize='2xl' color={textColor} fontWeight='900'>
                    語法檢查
                  </StatNumber>
                </Flex>

              </Stat>
              <IconBox
                borderRadius='50%'
                as='box'
                h={"45px"}
                w={"45px"}
                bg={iconteal}>
                <CheckIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
            <Text color='gray.400' fontSize='sm'>
              <Text color='gray.400' fontSize='sm'>擺脫語法錯誤
              </Text>
            </Text>
          </Flex>
        </Card>
      </SimpleGrid>






      <Grid templateColumns="2fr 1fr" gap="16px" h="100%">
        {/* 左側卡片：Main Projects Card */}
        <Card p="16px" my="24px">
          <CardHeader p="12px 5px" mb="12px">
            <Flex direction="column">
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Projects
              </Text>
              <Text fontSize="sm" color="gray.400" fontWeight="400">
                正在進行分析的項目
              </Text>
            </Flex>
          </CardHeader>
          <CardBody px="5px" h="100%">
            <Grid templateColumns="repeat(2, 1fr)" gap="16px" h="100%">
              {/* 左側按鈕 */}
              <Button
                p="0px"
                bg="transparent"
                border="1px solid lightgray"
                borderRadius="15px"
                h="100%"
              >
                <Flex direction="column" justifyContent="center" align="center">
                  <Icon as={FaPlus} color={textColor} fontSize="md" mb="8px" />
                  <Text fontSize="md" color={textColor} fontWeight="bold">
                    Create a New Project
                  </Text>
                </Flex>
              </Button>

              {/* 右側項目清單 */}
              <Flex direction="column" gap="12px" h="100%">
                {/* Project #1 */}
                <Flex direction="column" border="1px solid lightgray" borderRadius="15px" p="10px" h="100%">
                  <Box mb="12px" position="relative" borderRadius="15px" overflow="hidden">
                    <Image src={ImageArchitect1} borderRadius="15px" w="100%" h="120px" />
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      w="100%"
                      h="100%"
                      bg="linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8))"
                      borderRadius="15px"
                      zIndex="1"
                    />
                  </Box>
                  <Text fontSize="sm" color="gray.400" fontWeight="600" mb="6px">
                    Project #1
                  </Text>
                  <Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
                    Modern
                  </Text>
                  <Text fontSize="sm" color="gray.400" fontWeight="400" mb="12px">
                    Internal management turmoil description here.
                  </Text>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Button variant="dark" minW="90px" h="30px">
                      VIEW ALL
                    </Button>
                    <AvatarGroup size="xs">
                      <Avatar name="Ryan Florence" src={avatar6} />
                      <Avatar name="Segun Adebayo" src={avatar2} />
                    </AvatarGroup>
                  </Flex>
                </Flex>

                {/* Project #2 */}
                <Flex direction="column" border="1px solid lightgray" borderRadius="15px" p="10px" h="100%">
                  <Box mb="12px" position="relative" borderRadius="15px">
                    <Image src={ImageArchitect2} borderRadius="15px" w="100%" h="120px" />
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      w="100%"
                      h="100%"
                      bg="linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8))"
                      borderRadius="15px"
                      zIndex="1"
                    />
                  </Box>
                  <Text fontSize="sm" color="gray.400" fontWeight="600" mb="6px">
                    Project #2
                  </Text>
                  <Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
                    Scandinavian
                  </Text>
                  <Text fontSize="sm" color="gray.400" fontWeight="400" mb="12px">
                    Music-specific opinions description here.
                  </Text>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Button variant="dark" minW="90px" h="30px">
                      VIEW ALL
                    </Button>
                    <AvatarGroup size="xs">
                      <Avatar name="Kent Dodds" src={avatar3} />
                      <Avatar name="Prosper Otemuyiwa" src={avatar4} />
                    </AvatarGroup>
                  </Flex>
                </Flex>
              </Flex>
            </Grid>
          </CardBody>
        </Card>

        {/* 右側卡片：RightPanelWithCalendar */}
        <Card p="16px" my="24px">
          <CardHeader p="12px 5px" mb="12px">
            <Flex justify="space-between" align="center" w="100%">
              <Box>
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Calendar
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="400">
                  您的會議安排行事曆
                </Text>
              </Box>
              <Button bg="teal.500" color="white" variant="solid" p="10px" margin="7px" _hover={{ bg: "teal.400" }} opacity="0.9"   onClick={onOpen}>
                + New Meeting
              </Button>
            </Flex>
          </CardHeader>

          <CardBody px="5px" h="100%">
            <Flex justify="center" align="center" h="100%">
              <RightPanelWithCalendar />
            </Flex>
          </CardBody>
          {/* 新增會議的模態框 */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>新增會議</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb="8px">日期：</Text>
                <Input
                  type="date"
                  name="date"
                  value={newMeeting.date}
                  onChange={handleInputChange}
                  mb="16px"
                />
                <Text mb="8px">時間：</Text>
                <Input
                  type="time"
                  name="time"
                  value={newMeeting.time}
                  onChange={handleInputChange}
                  mb="16px"
                />
                <Text mb="8px">描述：</Text>
                <Input
                  type="text"
                  name="description"
                  placeholder="輸入會議描述"
                  value={newMeeting.description}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
                  提交
                </Button>
                <Button onClick={onClose}>取消</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Card>
      </Grid>





    </Flex>
  );
}