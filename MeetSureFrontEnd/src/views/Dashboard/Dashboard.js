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
import { FaClipboardList, FaCalendarAlt, FaBell, FaCheckCircle } from "react-icons/fa";



export default function Dashboard() {
  // Chakra Color Mode
  const iconteal = useColorModeValue("teal.500", "teal.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");

  const { colorMode } = useColorMode();

  const cards = [
    { title: "待辦事項", icon: FaClipboardList, content: "查看並管理你的待辦事項。" },
    { title: "重要會議", icon: FaCalendarAlt, content: "查看即將到來的會議安排。" },
    { title: "通知提醒", icon: FaBell, content: "查看最新的通知與消息。" },
    { title: "目標追蹤", icon: FaCheckCircle, content: "檢視你的長期目標進度。" },
  ];

  // 新增的邏輯狀態和處理函數
  const infoModal = useDisclosure();  // 管理資訊 Modal
  const meetingModal = useDisclosure();  // 管理新增會議 Modal
  const [selectedModalContent, setSelectedModalContent] = useState("");
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
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px" mb="20px">
        {cards.map((card, index) => (
          <Card
            key={index}
            bg="white"
            color="gray.800"
            p={6}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="lg"
            transition="all 0.3s ease-in-out"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "2xl",
              transition: "all 0.3s ease-in-out",
            }}
            onClick={() => {
              setSelectedModalContent(card.content);
              infoModal.onOpen();
            }}
          >
            <CardHeader pb={3}>
              <Flex align="center">
                {/* Icon 保持獨立 */}
                <Flex
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg="teal.500"
                  align="center"
                  justify="center"
                  mr={4}
                  boxShadow="sm"
                  transition="0.2s ease-in-out"
                  _hover={{ bg: "teal.600" }}
                >
                  <Icon as={card.icon} w={6} h={6} color="white" />
                </Flex>
                {/* 標題保持左對齊 */}
                <Text fontSize="xl" fontWeight="bold" letterSpacing="wide">
                  {card.title}
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text 
                fontSize="sm" 
                color="gray.500"
                ml={4} // ⭐ 讓內文稍微向左
                whiteSpace="nowrap" // ⭐ 確保內容不換行
                overflow="hidden" // ⭐ 避免超出卡片
                textOverflow="clip" // ⭐ 溢出時直接截斷 (可改為 ellipsis 顯示 "...")
                display="block"
              >
                {card.content}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={infoModal.isOpen} onClose={infoModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>詳細資訊</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedModalContent}</Text> {/* 顯示動態內容 */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={infoModal.onClose}>關閉</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>






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
              <Button bg="teal.500" color="white" variant="solid" p="10px" margin="7px" _hover={{ bg: "teal.400" }} opacity="0.9"   onClick={meetingModal.onOpen}>
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
          <Modal isOpen={meetingModal.isOpen} onClose={meetingModal.onClose} isCentered>
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
                <Button onClick={meetingModal.onClose}>取消</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Card>
      </Grid>





    </Flex>
  );
}