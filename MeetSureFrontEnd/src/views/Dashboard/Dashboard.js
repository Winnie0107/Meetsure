// Chakra imports
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

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
  useToast,
  FormControl,
  FormLabel,
  Textarea,
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
import MeetingSchedule from "./MeetingSchedule";

import axios from "axios";
import { FaClipboardList, FaCalendarAlt, FaBell, FaCheckCircle, FaMagic } from "react-icons/fa";
import LineLogo from "assets/img/LineLogo.png";

import UserBanner from "../../components/Tables/UserBanner";



export default function Dashboard() {
  const toast = useToast();

  // 用戶資料狀態
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isOpen, setIsOpen] = useState(false); // 控制彈窗開關
  const [generatedImg, setGeneratedImg] = useState(""); // 存放 AI 生成的頭貼
  const userId = localStorage.getItem("user_id"); // 取得用戶 ID
  const [newMeeting, setNewMeeting] = useState({
    name: "",
    datetime: "",
    location: "",
    details: ""
  });
  
  const { isOpen: isNameOpen, onOpen: onNameOpen, onClose: onNameClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();

  // 載入用戶資料
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:8000/api/profile?user_id=${userId}`)
      .then((res) => {
        setEmail(res.data.email || "");
        setName(res.data.name || "");
        setImg(res.data.img && res.data.img !== "null" ? res.data.img : "default-profile.png"); // ✅ 確保不會是 null
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      });
  }, [userId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (onClose) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
  
    if (!newMeeting.name || !newMeeting.datetime || !userId) {
      alert("請填寫完整資訊");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
    
      const response = await axios.post(
        "http://127.0.0.1:8000/api/meetings/add/",
        {
          name: newMeeting.name,
          date: newMeeting.datetime.split("T")[0],     // yyyy-mm-dd
          time: newMeeting.datetime.split("T")[1],     // hh:mm
          location: newMeeting.location,
          description: newMeeting.details,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    
  
      console.log("✅ 成功新增會議", response.data);
  
      // 清空表單
      setNewMeeting({ name: "", datetime: "", location: "", details: "" });
  
      // 關閉 Modal
      if (onClose) onClose();
  
      // 🔁 重新載入或更新前端資料
      // 你可以加入 setMeetings([...meetings, response.data]) 或 refetch
  
    } catch (error) {
      console.error("❌ 會議新增失敗：", error);
      alert("新增會議失敗，請再試一次");
    }
  };
    
  // **請求 OpenAI 生成 AI 頭貼**
  const handleGenerateAvatar = async () => {
    try {
      console.log("發送 user_id:", userId);  // ✅ Debug 檢查 userId 是否存在
      if (!userId) {
        console.error("❌ userId 未定義，請重新登入");
        return;
      }

      const response = await fetch("http://localhost:8000/api/generate_avatar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),  // ✅ 確保 user_id 被傳遞
      });

      const data = await response.json();
      console.log("AI 頭貼回應:", data); // ✅ Debug 回應

      if (data.base64_img) {
        setGeneratedImg(`data:image/png;base64,${data.base64_img}`); // ✅ 設定 Base64 圖片
      } else {
        console.error("❌ 生成頭貼失敗，未返回 Base64 圖片");
      }
    } catch (error) {
      console.error("❌ 生成頭貼請求錯誤:", error);
    }
  };


  const handleConfirmAvatar = async () => {
    if (!generatedImg || !userId) return;
  
    try {
      const response = await fetch("http://localhost:8000/api/update_avatar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, img_base64: generatedImg }), // 包含 base64 前綴
      });
  
      const data = await response.json();
      if (data.success && data.img_url) {
        setImg(data.img_url); // ✅ 更新 img 為 Firebase 的 URL
        handleCloseModal();
      } else {
        console.error("❌ 更新頭貼失敗:", data.error);
      }
    } catch (error) {
      console.error("❌ 請求錯誤:", error);
    }
  };
  


  // **更新名稱**
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast({
        title: "錯誤",
        description: "名稱不能為空",
        status: "error",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/update_name/", {
        user_id: userId,
        new_name: newName,
      });

      if (response.data.success) {
        setName(newName); // 更新 UI
        onNameClose(); // 關閉 Modal
        toast({ title: "名稱更新成功", status: "success" });
      } else {
        toast({ title: "更新失敗", description: response.data.error, status: "error" });
      }
    } catch (error) {
      console.error("更新名稱時發生錯誤", error);
    }
  };

  // **更新密碼**
  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "錯誤", description: "密碼不匹配", status: "error" });
      return;
    }

    axios.post("http://localhost:8000/api/update_password/", {
      user_id: userId,
      new_password: newPassword, // 這裡發送的是明文，後端會加密
    })
      .then(() => { // ✅ 移除 `res`
        toast({ title: "密碼修改成功", status: "success" });
        onPasswordClose();
      })
      .catch((err) => {
        console.error("密碼修改失敗:", err);
        toast({ title: "錯誤", description: "無法修改密碼", status: "error" });
      });
  };



  // **開啟彈窗**
  const handleOpenModal = () => setIsOpen(true);
  // **關閉彈窗**
  const handleCloseModal = () => setIsOpen(false);

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
  const lineModal = useDisclosure();
  const [isLineBound, setIsLineBound] = useState(true);


  // ✅ 檢查是否綁定 LINE
  useEffect(() => {
    const checkLineBinding = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/check-line-binding/", {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        if (!res.data.is_linked) {
          setIsLineBound(false);
          lineModal.onOpen();
        }
      } catch (err) {
        console.error("檢查 LINE 綁定狀態失敗:", err);
      }
    };
    checkLineBinding();
  }, []);




  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      <UserBanner
        name={name}
        email={email}
        img={img}
        isNameOpen={isNameOpen}
        onNameOpen={onNameOpen}
        onNameClose={onNameClose}
        newName={newName}
        setNewName={setNewName}
        handleUpdateName={handleUpdateName}
        isPasswordOpen={isPasswordOpen}
        onPasswordOpen={onPasswordOpen}
        onPasswordClose={onPasswordClose}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleUpdatePassword={handleUpdatePassword}
        isOpen={isOpen}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        generatedImg={generatedImg}  // ✅ 確保有傳遞 generatedImg
        setGeneratedImg={setGeneratedImg}
        handleGenerateAvatar={handleGenerateAvatar}
        handleConfirmAvatar={handleConfirmAvatar}
      />
      

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

      {/* ✅ 尚未綁定 LINE 的提示 Modal */}
      <Modal isOpen={lineModal.isOpen} onClose={lineModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={6} boxShadow="lg">
          <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center" color="teal.600">
            尚未綁定 LINE 帳號
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" textAlign="center">
              <Image src={LineLogo} alt="LINE" boxSize="64px" mb={4} />
              <Text fontSize="md" mb={4} lineHeight="1.8">
                為了讓您能夠即時收到會議通知與提醒，<br />我們建議您綁定 LINE 帳號。
              </Text>
              <Box
                textAlign="left"
                fontSize="sm"
                color="gray.700"
                bg="gray.50"
                p={5}
                borderRadius="lg"
                w="100%"
                boxShadow="sm"
              >
                <Text fontWeight="semibold" mb={3}>綁定後你可以：</Text>

                <Flex align="center" mb={2}>
                  <CheckIcon color="teal.500" mr={2} />
                  <Text>會議建立、修改、自動提醒</Text>
                </Flex>

                <Flex align="center" mb={2}>
                  <Icon as={FaBell} color="teal.500" mr={2} />
                  <Text>即時 LINE 通知，免登入也能查訊息</Text>
                </Flex>

                <Flex align="center">
                  <Icon as={FaMagic} color="teal.500" mr={2} />
                  <Text>更多智慧整合功能開發中</Text>
                </Flex>
              </Box>

            </Flex>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="teal"
              px={8}
              size="md"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
              onClick={lineModal.onClose}
            >
              確認
            </Button>
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
              <Button bg="teal.500" color="white" variant="solid" p="10px" margin="7px" _hover={{ bg: "teal.400" }} opacity="0.9" onClick={meetingModal.onOpen}>
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
          {/* ✅ 新會議記錄 Modal（取代原本的新增會議） */}
          {/* ✅ 新增會議 Modal（簡化版，只保留新增） */}
          <Modal isOpen={meetingModal.isOpen} onClose={meetingModal.onClose}>
            <ModalOverlay />
            <ModalContent p={4} borderRadius="25px" minW="600px">
              <ModalHeader>新增會議</ModalHeader>
              <ModalCloseButton mt="4" mr="4" />
              <ModalBody>
                <FormControl mb={3}>
                  <FormLabel>會議名稱</FormLabel>
                  <Input name="name" value={newMeeting.name} onChange={handleInputChange} placeholder="輸入會議名稱..." />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel>選擇會議時間</FormLabel>
                  <Input
                    type="datetime-local"
                    name="datetime"
                    value={newMeeting.datetime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel>會議地點</FormLabel>
                  <Input name="location" value={newMeeting.location} onChange={handleInputChange} placeholder="輸入會議地點..." />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel>會議連結或其他資訊</FormLabel>
                  <Textarea name="details" value={newMeeting.details} onChange={handleInputChange} placeholder="輸入您的資訊..." minHeight="110px" resize="vertical" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={meetingModal.onClose}>取消</Button>
                <Button colorScheme="teal" onClick={() => handleSubmit(meetingModal.onClose)}>確認新增</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>



        </Card>
      </Grid>





    </Flex>
  );
}