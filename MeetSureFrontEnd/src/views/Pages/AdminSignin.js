import React, { useState, useEffect } from "react";
import {
  Flex,
  Button,
  Box,
  Image,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import MeetSureLogo from "assets/img/MeetSureLogo.png";
import axios from "axios";

function AdminSignIn() {
  const bgColor = "#1E293B";
  const cardBg = "linear-gradient(135deg, #E2E8F0 0%, #F7FAFC 100%)";
  const textColor = "teal.500";
  const buttonColor = "teal.500";
  const hoverButtonColor = "teal.600";

  const [currentStep, setCurrentStep] = useState("selectCompany");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/companies/`);
        setCompanyList(res.data);
      } catch (error) {
        console.error("無法取得公司列表", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("請填寫電子郵件和密碼");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login/admin/`, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token); // ✅ 存下來
      const data = response.data;

      if (data.role === "system_admin" || data.role === "company_admin") {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);
        window.location.href = data.redirect_url;
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || "登入失敗");
      } else {
        setErrorMessage("發生未知錯誤");
      }
    }
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

  return (
    <Flex
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      bg={bgColor}
      p="20px"
    >
      <Box
        bg={cardBg}
        p="40px"
        borderRadius="20px"
        border="1px solid #CBD5E0"
        boxShadow="0px 6px 18px rgba(0, 0, 0, 0.1)"
        w="400px"
        transition="transform 0.3s"
        _hover={{ transform: "scale(1.02)" }}
      >
        {/* 公司選擇 */}
        {currentStep === "selectCompany" && (
          <>
            {renderLogo()}
            <Text
              fontSize="xl"
              color={textColor}
              fontWeight="bold"
              textAlign="center"
              mb="22px"
            >
              選擇公司
            </Text>
            <FormControl mb="16px">
  <FormLabel fontSize="sm" color="gray.700" mb="1">
    搜尋公司名稱
  </FormLabel>
  <Input
    placeholder="輸入關鍵字"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setErrorMessage("");
    }}
    bg="white"
    size="lg"
    borderRadius="md"
    border="1px solid #CBD5E0"
    _focus={{
      borderColor: "teal.400",
      boxShadow: "0 0 0 1px teal.400",
    }}
  />

  {/* 自動建議區塊 */}
  {searchQuery && (
    <Box
      mt="2"
      borderRadius="md"
      border="1px solid #E2E8F0"
      bg="white"
      maxH="150px"
      overflowY="auto"
      zIndex="1"
      position="relative"
    >
      {companyList.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).length === 0 ? (
        <Text p="3" fontSize="sm" color="gray.500">沒有符合的公司名稱</Text>
      ) : (
        companyList
          .filter(company =>
            company.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(company => (
            <Box
              key={company.id}
              px="4"
              py="2"
              fontSize="md"
              _hover={{ bg: "teal.100", cursor: "pointer" }}
              onClick={() => {
                setSelectedCompany(company.name);
                setSearchQuery(company.name);
              }}
            >
              {company.name}
            </Box>
          ))
      )}
    </Box>
  )}

  {errorMessage && (
    <Text color="red.500" fontSize="sm" mt="2">
      {errorMessage}
    </Text>
  )}
</FormControl>

<Button
  w="100%"
  h="45px"
  fontWeight="bold"
  fontSize="md"
  bg={searchQuery ? buttonColor : "gray.300"}
  color="white"
  _hover={{ bg: searchQuery ? hoverButtonColor : "gray.400" }}
  mb="24px"
  onClick={() => {
    const matchedCompany = companyList.find((company) =>
      company.name.toLowerCase() === searchQuery.toLowerCase()
    );
    if (matchedCompany) {
      setSelectedCompany(matchedCompany.name);
      setCurrentStep("companyAdminLogin");
      setErrorMessage("");
    } else {
      setErrorMessage("請選擇正確的公司名稱");
    }
  }}
  isDisabled={!searchQuery}
>
  確認選擇
</Button>

          </>
        )}

        {/* 公司管理員登入 */}
        {currentStep === "companyAdminLogin" && (
          <>
            {renderLogo()}
            <Text
              fontSize="xl"
              color={textColor}
              fontWeight="bold"
              textAlign="center"
              mb="22px"
            >
              歡迎! {selectedCompany}
            </Text>
            {errorMessage && (
              <Text color="red.500" fontSize="sm" mb="16px">
                {errorMessage}
              </Text>
            )}
            <FormControl>
              <FormLabel fontSize="sm" color="gray.700">
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="Your email address"
                mb="24px"
                size="lg"
                bg="gray.100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel fontSize="sm" color="gray.700">
                密碼
              </FormLabel>
              <Input
                type="password"
                placeholder="Your password"
                mb="24px"
                size="lg"
                bg="gray.100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                w="100%"
                h="45px"
                bg={buttonColor}
                color="white"
                _hover={{ bg: hoverButtonColor }}
                mb="24px"
                onClick={handleLogin}
              >
                登入
              </Button>
              <Button
                w="100%"
                h="45px"
                bg="gray.600"
                color="white"
                _hover={{ bg: "gray.500" }}
                onClick={() => {
                  setCurrentStep("selectCompany");
                  setSearchQuery("");
                  setErrorMessage("");
                }}
              >
                返回公司選擇
              </Button>
            </FormControl>
          </>
        )}
      </Box>
    </Flex>
  );
}

export default AdminSignIn;
