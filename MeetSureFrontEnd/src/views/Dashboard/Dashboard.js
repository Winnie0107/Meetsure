// Chakra imports
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";


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
import "../../assets/css/CalendarStyles.css";

// Custom icons
import { CheckIcon } from '@chakra-ui/icons';


import projectimg from "assets/img/buildproject.png";

import {
  FaPlus, FaFolderPlus
} from "react-icons/fa";
import RightPanelWithCalendar from './RightPanelWithCalendar';

import axios from "axios";
import { FaBell, FaCheckCircle, FaMagic } from "react-icons/fa";
import LineLogo from "assets/img/LineLogo.png";

import UserBanner from "../../components/Tables/UserBanner";
import getAvatarUrl from "components/Icons/getAvatarUrl";



export default function Dashboard() {
  const toast = useToast();
  const history = useHistory();

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

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);


  const { isOpen: isNameOpen, onOpen: onNameOpen, onClose: onNameClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();

  // 載入用戶資料
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/profile?user_id=${userId}`)
      .then((res) => {
        setEmail(res.data.email || "");
        setName(res.data.name || "");
        setImg(res.data.img && res.data.img !== "null" ? res.data.img : null); // ✅ 確保不會是 null
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      });
  }, [userId]);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects/get/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setProjects(response.data);
      } catch (error) {
        console.error("❌ 無法獲取專案列表:", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);


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
        `${process.env.REACT_APP_API_URL}/meetings/add/ `,
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

      const response = await fetch( `${process.env.REACT_APP_API_URL}/generate_avatar/ `, {
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
      const response = await fetch( `${process.env.REACT_APP_API_URL}/update_avatar/ `, {
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
      const response = await axios.post( `${process.env.REACT_APP_API_URL}/update_name/ `, {
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

    axios.post( `${process.env.REACT_APP_API_URL}/update_password/ `, {
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

  const myProjects = projects.filter((project) =>
    project.members_name?.some((member) => member.user_id === parseInt(userId))
  );


  // **開啟彈窗**
  const handleOpenModal = () => setIsOpen(true);
  // **關閉彈窗**
  const handleCloseModal = () => setIsOpen(false);

  // Chakra Color Mode
  const textColor = useColorModeValue("gray.700", "white");

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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/check-line-binding/`, {
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
            <Flex justify="space-between" align="center" w="100%">
              <Box>
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  專案列表
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="400">
                  正在進行中的專案
                </Text>
              </Box>
              <Button
                bg="teal.500"
                color="white"
                variant="solid"
                p="10px"
                margin="7px"
                _hover={{ bg: "teal.400" }}
                opacity="0.9"
                onClick={() => history.push("/admin/tables")}
              >
                查看所有專案
              </Button>


            </Flex>
          </CardHeader>


          <CardBody px="5px" h="100%">
            <Grid templateColumns="repeat(3, 1fr)" gap="16px">
              {/* Create Project Button */}
              <Button
                p="0px"
                bg="gray.50"
                border="1px solid lightgray"
                borderRadius="lg"
                h="100%"
                minH="270px"
                boxShadow="sm"
                transition="all 0.3s"
                _hover={{ boxShadow: "md" }}
                onClick={() => history.push("/admin/project")}
              >
                <Flex direction="column" justifyContent="center" align="center">
                  <Icon as={FaPlus} color={textColor} fontSize="sm" mb="8px" />
                  <Text fontSize="md" color={textColor} fontWeight="bold">
                    創建新專案
                  </Text>
                </Flex>
              </Button>

              {loadingProjects ? (
                <Text>載入中...</Text>
              ) : myProjects.length === 0 ? (

                <Flex
                  w="100%"
                  h="300px"
                  align="center"
                  justify="center"
                  border="1px solid lightgray"
                  borderRadius="lg"
                  p={8}
                  flexDirection="column"
                  textAlign="center"
                  bg="gray.50"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{ boxShadow: "md" }}
                >
                  {/* 添加空狀態插圖 */}
                  <Box mb={4}>
                    <Icon as={FaFolderPlus} fontSize="5xl" color="teal.400" />
                  </Box>

                  <Text fontSize="xl" fontWeight="600" mb={2}>
                    目前尚無專案
                  </Text>

                  <Text fontSize="md" color="gray.500" mb={6}>
                    建立你的第一個專案，開始組織你的工作並提升團隊協作效率！
                  </Text>

                </Flex>
              ) : (
                myProjects.map((project) => (
                  <Flex key={project.id} direction="column" border="1px solid lightgray" borderRadius="15px" p="10px" minH="270px">
                    <Box position="relative" borderRadius="15px" overflow="hidden" w="100%" pt="100%">
                      <Image
                        src={projectimg}
                        position="absolute"
                        top="0"
                        left="0"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        borderRadius="15px"
                      />
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        w="100%"
                        h="100%"
                        bg="linear-gradient(to bottom, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.1))"
                        borderRadius="15px"
                        zIndex="1"
                      />
                    </Box>

                    {/* 專案名稱與描述 */}
                    <Text fontSize="sm" color="gray.400" fontWeight="600" mb="6px">
                      {`專案 #${project.id}`}
                    </Text>
                    <Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
                      {project.name}
                    </Text>
                    <Text fontSize="sm" color="gray.400" fontWeight="400" mb="12px">
                      {project.description || "尚無描述"}
                    </Text>

                    <Flex justifyContent="space-between" alignItems="center">
                      <Button fontSize="sm" variant="dark" minW="90px" h="30px" onClick={() => history.push(`/admin/projectmanagement/${project.id}`)}>
                        查看
                      </Button>
                      <AvatarGroup size="xs">
                        {/* 顯示參與者頭像（最多2個） */}
                        {project.members_name?.slice(0, 2).map((member) => (
                          <Avatar src={getAvatarUrl(img)} />
                        ))}
                      </AvatarGroup>
                    </Flex>
                  </Flex>
                ))
              )}


            </Grid>
          </CardBody>
        </Card>


        {/* 右側卡片：RightPanelWithCalendar */}
        <Card p="16px" my="24px">
          <CardHeader p="12px 5px" mb="12px">
            <Flex justify="space-between" align="center" w="100%">
              <Box>
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  個人行事曆
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="400">
                  您的會議安排行事曆
                </Text>
              </Box>
              <Button bg="teal.500" color="white" variant="solid" p="10px" margin="7px" _hover={{ bg: "teal.400" }} opacity="0.9" onClick={meetingModal.onOpen}>
                新增會議
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