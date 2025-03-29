import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import axios from "axios";
import { FaEdit } from "react-icons/fa"; 
function Profile() {
  const { colorMode } = useColorMode();
  const toast = useToast();

  // **用戶資料狀態**
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [img, setImg] = useState(""); // **目前的頭貼 URL**
  
  // **AI 頭貼相關狀態**
  const [isOpen, setIsOpen] = useState(false); // 控制彈窗開關
  const [generatedImg, setGeneratedImg] = useState(""); // 存放 AI 生成的頭貼
  const userId = localStorage.getItem("user_id"); // 取得用戶 ID

  // Chakra UI 顏色設定
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");

  // **Modal 控制**
  const { isOpen: isNameOpen, onOpen: onNameOpen, onClose: onNameClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();

  // **名稱更新**
  const [newName, setNewName] = useState("");
  // **密碼更新**
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:8000/api/profile?user_id=${userId}`)
      .then((res) => {
        setEmail(res.data.email || "");
        setPassword(res.data.password || "");
        setName(res.data.name || "");
        setLevel(res.data.acco_level || "");
        setImg(res.data.img || "default-profile.png");
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      });
  }, [userId]);

  // **開啟彈窗**
  const handleOpenModal = () => setIsOpen(true);
  // **關閉彈窗**
  const handleCloseModal = () => setIsOpen(false);

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
        body: JSON.stringify({ user_id: userId, img_base64: generatedImg }),
      });
  
      const data = await response.json();
      if (data.success) {
        setImg(generatedImg); // ✅ 更新 UI 頭貼
        handleCloseModal();  // ✅ 關閉 Modal
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
  
  

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px", lg: "100px" }}>
      {/* 頂部大頭貼橫幅 */}
      <Flex
        direction={{ sm: "column", md: "row" }}
        mb="24px"
        maxH="330px"
        justifyContent={{ sm: "center", md: "space-between" }}
        align="center"
        backdropFilter="blur(21px)"
        boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
        border="1.5px solid"
        borderColor={borderProfileColor}
        bg={bgProfile}
        p="24px"
        borderRadius="20px"
      >
        <Flex align="center">
          <Avatar src={img?.startsWith("data:image") ? img : `http://localhost:8000/media/${img}`} w="120px" h="120px" borderRadius="full" mb="20px" />
          <Flex direction="column" ml="20px">
            <Text fontSize="23px" fontWeight="bold" color={textColor}>{name || "Name"}</Text>
            <Text fontSize="18px" color={emailColor}>{email}</Text>
          </Flex>
        </Flex>
        <Flex direction="row" gap="10px">
          <Button leftIcon={<FaEdit />} variant="outline" colorScheme="gray" onClick={onNameOpen}>
            修改名稱
          </Button>
          <Button leftIcon={<i className="fas fa-key"></i>} variant="outline" colorScheme="gray" onClick={onPasswordOpen}>
            修改密碼
          </Button>
          <Button leftIcon={<i className="fas fa-user-circle"></i>} variant="outline" colorScheme="gray" onClick={handleOpenModal}>
            新增頭貼
          </Button>
        </Flex>
      </Flex>


      {/* 下方三個區塊 */}
      <Grid templateColumns={{ sm: "1fr", xl: "repeat(3, 1fr)" }} gap="22px">
        {/* 1) Profile Picture 區塊 */}
        <Card p="16px">
          <CardHeader p="12px 5px" mb="12px">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Profile Picture
            </Text>
          </CardHeader>
          <CardBody px="5px">
            <Flex direction="column" align="center">
              <Avatar src={img?.startsWith("data:image") ? img : `http://localhost:8000/media/${img}`} w="120px" h="120px" mb="10px" />
              <Button onClick={handleOpenModal} mt="10px">
                修改頭貼
              </Button>
            </Flex>
          </CardBody>
        </Card>

        {/* AI 頭貼選擇的 Modal 彈窗 */}
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>選擇你的 AI 頭貼</ModalHeader>
            <ModalBody>
              {generatedImg ? (
                <Avatar src={generatedImg} w="150px" h="150px" />
              ) : (
                <Text>點擊「生成頭貼」來試試！</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleGenerateAvatar}>生成頭貼</Button>
              <Button onClick={handleConfirmAvatar} isDisabled={!generatedImg}>確認</Button>

            </ModalFooter>
          </ModalContent>
        </Modal>


        {/* 2) Profile Name 區塊 */}
        <Card p="16px">
          <CardHeader p="12px 5px" mb="16px" px="13px" >
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Profile
            </Text>
          </CardHeader>
          <CardBody px="5px">
            <Flex direction="column" align="center" w="100%">
              {/* Name 欄位 */}
              <Flex
                justify="space-between"
                align="center"
                w="100%"
                p="14px"
                borderRadius="12px"
                px="0"
                bg="white"
                mb="20px" // 增加欄位間距
              >
                <Text fontSize="md" fontWeight="bold" color={textColor} ml="10px">
                  使用者名稱： {name}
                </Text>
                <Button
                  size="sm"
                  bg="#148aac" // 設定綠色背景
                  color="white"   // 設定白色字體
                  _hover={{ bg: "gray.400" }} // 滑鼠懸停變深色
                  mr="10px"
                  fontWeight="normal"
                  leftIcon={<FaEdit />}
                  onClick={onNameOpen}
                >
                  修改
                </Button>
              </Flex>

              {/* Password 欄位 */}
              <Flex
                justify="space-between"
                align="center"
                w="100%"
                p="14px"
                borderRadius="12px"
                px="0"
                bg="white"
                mb="25px" // 增加欄位間距
              >
                <Text fontSize="md" fontWeight="bold" color={textColor} ml="10px">
                  密碼： ●●●●●●●
                </Text>
                <Button
                  size="sm"
                  bg="#148aac" // 設定綠色背景
                  color="white"   // 設定白色字體
                  _hover={{ bg: "gray.400" }} // 滑鼠懸停變深色
                  mr="10px"
                  fontWeight="normal"
                  leftIcon={<FaEdit />}
                  onClick={onNameOpen}
                >
                  修改
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>


        
      {/* 修改名稱的 Modal */}
      <Modal isOpen={isNameOpen} onClose={onNameClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>修改你的名稱</ModalHeader>
          <ModalBody>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="輸入新名稱" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdateName}>確認修改</Button>
            <Button variant="ghost" onClick={onNameClose}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 修改密碼的 Modal */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>修改密碼</ModalHeader>
          <ModalBody>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="輸入新密碼" mb="3" />
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="確認新密碼" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdatePassword}>提交</Button>
            <Button variant="ghost" onClick={onPasswordClose}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Grid>
    </Flex>
  );
}

export default Profile;
