import React, { useState } from "react";
import {
  Flex,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Select,
  Image,
  Progress,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import MeetSureLogo from "assets/img/MeetSureLogo.png";
import BgSignUp from "assets/img/BgSignUp.png";


function CompanyAccountApplication() {
  const [currentStep, setCurrentStep] = useState("companyAccount");
  const [companyName, setCompanyName] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [plan, setPlan] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);

  const [companyId, setCompanyId] = useState(null);

  const handleSubmitCompanyAccount = async () => {
    if (!companyName || !responsiblePerson || !companyDescription || !plan) {
      alert("請完整填寫所有欄位");
      return;
    }
  
    const companyData = {
      name: companyName,
      owner: responsiblePerson,
      description: companyDescription,
      plan: plan,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register_company/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("公司帳號購買成功！");
        setCompanyId(data.company_id);  // 確保 company_id 有被儲存
        setCurrentStep("representativeAccount"); // 進入下一步
      } else {
        alert("註冊失敗：" + (data.error || "未知錯誤"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("發生錯誤，請稍後再試");
    }
  };
  

  const handleSubmitRepresentativeAccount = async () => {
    if (!accountName || !password || !confirmPassword || !companyEmail || !companyId) {
      alert("請完整填寫所有欄位");
      return;
    }
    if (password !== confirmPassword) {
      alert("密碼不一致，請重新輸入");
      return;
    }
    const representativeData = {
      account_name: accountName,  
      email: companyEmail,  
      password: password,  
      company_id: companyId,  
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register_representative/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(representativeData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("公司代表帳號註冊成功！");
        window.location.href = "/#/auth/homepage";  // ✅ 成功後直接跳轉

      } else {
        alert("註冊失敗：" + (data.error || "未知錯誤"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("發生錯誤，請稍後再試");
    }
  };
  
  const handleBackToCompanyAccount = () => {
    setCurrentStep("companyAccount");
  };


  const getProgress = () => {
    let progress = 0;
    if (companyName) progress += 20;
    if (responsiblePerson) progress += 20;
    if (companyDescription) progress += 20;
    if (plan) progress += 20;
    if (accountName && password && confirmPassword && companyEmail) progress += 20;
    return progress;
  };


  const renderLogo = () => (
    <Image
      src={MeetSureLogo}
      alt="MeetSure Logo"
      w="120px"
      mx="auto"
      mb="20px"
    />
  );

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
        {renderLogo()}
        <Box width="100%" mt="10px" mb="20px">
          <Text>填寫進度: {getProgress()}%</Text>
          <Progress value={getProgress()} size="sm" colorScheme="teal" />
        </Box>


        {currentStep === "companyAccount" && (
          <VStack spacing="20px">
            <Text
              fontSize="xl"
              color="teal.500"
              fontWeight="bold"
              textAlign="center"
            >
              公司帳號申請
            </Text>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                公司名稱
              </FormLabel>
              <Input
                type="text"
                placeholder="輸入公司名稱"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                公司負責人姓名
              </FormLabel>
              <Input
                type="text"
                placeholder="輸入公司負責人姓名"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                公司簡介名稱
              </FormLabel>
              <Textarea
                placeholder="輸入公司簡介名稱"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                方案選擇
              </FormLabel>
              <Select
                placeholder="選擇方案"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              >
                <option value="normal">MeetSureFree</option>
                <option value="basic">MeetSurePlus</option>
                <option value="premium">MeetSurePro</option>
              </Select>
            </FormControl>
            <Button
              w="100%"
              bg="teal.500"
              color="white"
              _hover={{ bg: "teal.600" }}
              onClick={handleSubmitCompanyAccount}
            >
              下一步
            </Button>
            <Button
              w="100%"
              bg="gray.300"
              color="black"
              _hover={{ bg: "gray.400" }}
              onClick={() => setIsModalOpen(true)}
            >
              查看方案
            </Button>
          </VStack>
        )}


        {currentStep === "representativeAccount" && (
          <VStack spacing="20px">
            <Text
              fontSize="xl"
              color="teal.500"
              fontWeight="bold"
              textAlign="center"
            >
              公司代表帳號申請
            </Text>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                帳號名稱
              </FormLabel>
              <Input
                type="text"
                placeholder="輸入帳號名稱"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                密碼
              </FormLabel>
              <Input
                type="password"
                placeholder="設定密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                再次確認密碼
              </FormLabel>
              <Input
                type="password"
                placeholder="再次輸入密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                公司 Email
              </FormLabel>
              <Input
                type="email"
                placeholder="輸入公司 Email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </FormControl>
            <Button
              w="100%"
              bg="teal.500"
              color="white"
              _hover={{ bg: "teal.600" }}
              onClick={handleSubmitRepresentativeAccount}
            >
              提交申請
            </Button>
            <Button
              w="100%"
              bg="gray.300"
              color="black"
              _hover={{ bg: "gray.400" }}
              onClick={handleBackToCompanyAccount}
            >
              上一步
            </Button>
          </VStack>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" color="teal.500">
              方案詳情
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box p="4" bg="gray.50" borderRadius="md" mb="4" boxShadow="sm">
                <Text fontWeight="bold" fontSize="lg" mb="2" color="teal.500">
                  MeetSurePlus
                </Text>
                <Text fontSize="sm" color="gray.700">
                  適合中小型企業，提供基礎功能。
                </Text>
                <Text mt="2" fontSize="sm" color="gray.700">
                  <strong>價格：</strong>$1500/5個帳號
                </Text>
                <Text fontSize="sm" color="gray.700">
                  <strong>時數：</strong>總共可用40小時/月
                </Text>
              </Box>


              <Box p="4" bg="gray.50" borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold" fontSize="lg" mb="2" color="teal.500">
                  MeetSurePro
                </Text>
                <Text fontSize="sm" color="gray.700">
                  適合大型企業，包含進階功能與專屬支援。
                </Text>
                <Text mt="2" fontSize="sm" color="gray.700">
                  <strong>價格：</strong>$4500/15個帳號
                </Text>
                <Text fontSize="sm" color="gray.700">
                  <strong>時數：</strong>總共可用120小時/月
                </Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={() => setIsModalOpen(false)}>
                關閉
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>


      </Box>
    </Flex>
  );
}


export default CompanyAccountApplication;
