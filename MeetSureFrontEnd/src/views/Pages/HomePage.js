import React from "react";
import { Box, Text, Button, Flex, Image, Stack, Icon, Link, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { AiOutlineGlobal, AiOutlineProfile, AiOutlineUpload, AiOutlineCheckCircle, AiOutlineArrowRight, AiOutlineDollarCircle } from 'react-icons/ai';
import { ChevronDownIcon } from '@chakra-ui/icons'; // 用於顯示下拉箭頭


import MeetSureLogo from 'assets/img/MeetSureLogo.jpg';
import MeetSureText from 'assets/img/MeetSureText.jpg';

const HomePage = () => {
  return (
    <Flex direction="column" bg="#E0F2F1" minH="100vh" overflow="hidden">
      {/* 導航欄 */}
      <Flex
        as="nav"
        bg="#ffffff"
        boxShadow="sm"
        w="100%"
        px={{ base: 6, md: 10 }}
        py={4}
        align="center"
        justify="space-between"
      >
        <Flex align="center" gap={0} pl={2}> {/* 使用 pl={2} 來調整內邊距 */}
          <Image src={MeetSureLogo} alt="MeetSure Logo" w="auto" h="45" />
          <Image src={MeetSureText} alt="MeetSure Text" w="auto" h="35" />
        </Flex>

        <Flex gap={4}>
          {/* 平台功能下拉選單 */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="outline"
              colorScheme="blue"
              borderColor="#1A237E"
              color="#1A237E"
              borderRadius="16px" // 圓角

              _hover={{ backgroundColor: "#E6F7FA", borderColor: "#303F9F" }}
            >
              功能一覽
            </MenuButton>
            <MenuList>
              <MenuItem>智能寫作</MenuItem>
              <MenuItem>ChatRoom</MenuItem>
              <MenuItem>自動翻譯</MenuItem>
              <MenuItem>語法檢查</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="outline"
              colorScheme="blue"
              borderColor="#1A237E"
              color="#1A237E"
              borderRadius="16px" // 圓角
              _hover={{
                bg: "#E6F7FA",
                borderColor: "#303F9F",
                transform: "scale(1.05)", // 放大效果
                transition: "all 0.2s ease-in-out", // 平滑過渡
              }}
            >
              登入
            </MenuButton>
            <MenuList>
              <MenuItem
                as={Link}
                href="/#/auth/signin"
                _hover={{ textDecoration: "none" }}
              >
                用戶登入
              </MenuItem>
              <MenuItem
                as={Link}
                href="/#/auth/adminsignin"
                _hover={{ textDecoration: "none" }}
              >
                後台管理登入
              </MenuItem>
            </MenuList>
          </Menu>



          <Button
            as={Link}
            href="/#/auth/signup"
            bg="#1A237E"
            color="#ffffff"
            borderRadius="16px" // 圓角
            _hover={{ bg: "#303F9F" }}
          >
            註冊
          </Button>
          <Button
            as={Link}
            href="/#/auth/company"
            bg="#FF4081"
            color="#ffffff"
            borderRadius="16px" // 圓角

            _hover={{ bg: "#FF80AB" }}
          >
            公司帳號申請
          </Button>
        </Flex>
      </Flex>

      {/* 主內容 */}
      <Flex direction="column" align="center" justify="center" flex="1">
        <Stack spacing={6} align="center" textAlign="center" mb={0} py={8}>
          <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="bold" color="#333333" mb={4}>
            將每場對話轉為
          </Text>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" color="#1A237E" mb={4}>
            更有價值的洞察分析
          </Text>
          <Text fontSize="lg" color="#4A4A4A" maxW="800px">
            利用 AI 技術進行翻譯、聊天、語法檢查，助力個人與企業提升效率，挖掘對話中的價值。
          </Text>
        </Stack>


        <Flex
          justify="center"
          align="center"
          flexDirection={{ base: "column", md: "row" }}
          gap={8}
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }} // 減小上方留白

          w="100%"
          maxW="1200px"
        >
          <Image
            src="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?q=80&w=2992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="AI Illustration"
            borderRadius="lg"
            boxShadow="md"
            flexShrink={0}
            w={{ base: "90%", md: "50%" }}
            mb={{ base: 3, md: 0 }} // 增加底部留白

          />
          <Stack spacing={6} maxW="600px">
            <Flex align="center">
              <Icon as={AiOutlineCheckCircle} color="#1A237E" w={6} h={6} />
              <Text ml={3} fontSize="lg" fontWeight="medium" color="#4A4A4A">
                支援多語言處理，全球化溝通更輕鬆
              </Text>
            </Flex>
            <Flex align="center">
              <Icon as={AiOutlineCheckCircle} color="#1A237E" w={6} h={6} />
              <Text ml={3} fontSize="lg" fontWeight="medium" color="#4A4A4A">
                兩分鐘轉錄文本，高效處理工作
              </Text>
            </Flex>
            <Flex align="center">
              <Icon as={AiOutlineCheckCircle} color="#1A237E" w={6} h={6} />
              <Text ml={3} fontSize="lg" fontWeight="medium" color="#4A4A4A">
                團隊協作零成本，快速提高效率
              </Text>
            </Flex>
          </Stack>
        </Flex>

        {/* 專案流程介紹 */}
        <Box bg="#ffffff" py={12} px={{ base: 6, md: 12 }} w="100%">
          <Stack spacing={8} align="center" textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="#1A237E">
              專案建立流程
            </Text>
            <Text fontSize="lg" color="#4A4A4A" maxW="800px">
              我們的專案流程幫助用戶有條理地規劃進度，提升會議效率。
            </Text>
            <Flex
              wrap="wrap"
              justify="center"
              gap={6}
              maxW="1200px"
            >
              {[
                {
                  title: "建立專案",
                  description: "快速建立會議專案，為後續規劃奠定基礎。",
                  bgColor: "#D1F2EB",
                },
                {
                  title: "選擇專案任務",
                  description: "根據專案需求選擇適合的任務。",
                  bgColor: "#AED6F1",
                },
                {
                  title: "設定專案進度條件",
                  description: "將所有的任務及會議進行排程。",
                  bgColor: "#F5B7B1",
                },
                {
                  title: "開始使用專案管理",
                  description: "將任務與會議安排進行整合，提升效率。",
                  bgColor: "#A3E4D7",
                },
              ].map((item, index) => (
                <Flex
                  key={index}
                  direction="column"
                  align="center"
                  bg={item.bgColor}
                  position="relative" // 確保箭頭定位正確
                  clipPath="polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" // 創建向右箭頭
                  borderRadius="md"
                  boxShadow="md"
                  p={6}
                  textAlign="center"
                  w={{ base: "100%", md: "22%" }}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "scale(1.05)", // 放大效果
                    boxShadow: "lg",         // 增加陰影
                  }}
                >
                  <Text fontSize="xl" fontWeight="bold" mb={2} color="#333333">
                    {item.title}
                  </Text>
                  <Text fontSize="md" color="#4A4A4A">
                    {item.description}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Stack>
        </Box>

        {/* 協助頁面 */}

        <Box bg="#F4F6F9" py={12} px={{ base: 6, md: 12 }} w="100%">
          <Stack spacing={8} align="center" textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="#1A237E">
              行事曆與智能提醒
            </Text>
            <Text fontSize="lg" color="#4A4A4A" maxW="800px">
              使用 MeetSure，將會議日程輕鬆同步至行事曆。當會議即將開始時，系統會自動通知，讓你不再錯過任何重要時刻。
            </Text>
            <Flex
              wrap="wrap"
              justify="center"
              gap={6}
              maxW="1200px"
            >
              {[
                {
                  icon: AiOutlineGlobal,
                  title: "同步行事曆",
                  description: "快速整合會議日程到 Google 或 Outlook。",
                },
                {
                  icon: AiOutlineArrowRight,
                  title: "智能提醒",
                  description: "會議即將開始時，系統將自動通知。",
                },
                {
                  icon: AiOutlineCheckCircle,
                  title: "彈性規劃",
                  description: "輕鬆調整日程，保持工作井然有序。",
                },
              ].map((item, index) => (
                <Flex
                  key={index}
                  direction="column"
                  align="center"
                  bg="#ffffff"
                  borderRadius="md"
                  boxShadow="md"
                  p={6}
                  textAlign="center"
                  w={{ base: "100%", md: "30%" }}
                  transition="all 0.3s ease" // 平滑過渡效果
                  _hover={{
                    transform: "translateY(-8px)", // 懸浮時輕微上移
                    boxShadow: "lg",               // 增加陰影強度
                    borderColor: "#1A237E",        // 邊框顏色（可選）
                  }}
                >
                  <Icon as={item.icon} color="#1A237E" w={10} h={10} mb={4} />
                  <Text fontSize="xl" fontWeight="bold" mb={2} color="#333333">
                    {item.title}
                  </Text>
                  <Text fontSize="md" color="#4A4A4A">
                    {item.description}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Stack>
        </Box>
        <Box bg="#ffffff" py={12} px={{ base: 6, md: 12 }} w="100%">
          <Stack spacing={8} align="center" textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="#333333" animation="fadeIn 1s ease-in">
              公司帳號申請指南
            </Text>
            <Text fontSize="lg" color="#4A4A4A" maxW="800px" animation="fadeIn 1.5s ease-in">
              跟著以下步驟，輕鬆完成MeetSure公司帳號申請，快速加入我們的智慧會議管理平台。
            </Text>

            <Stack spacing={6} align="flex-start" w="100%" maxW="800px">
              {[
                {
                  step: "1",
                  content: "填寫公司基本資訊，包括公司名稱、負責人姓名及公司簡介。",
                  icon: AiOutlineProfile,
                },
                {
                  step: "2",
                  content: "選擇適合貴公司的MeetSure方案，了解功能與服務。",
                  icon: AiOutlineDollarCircle,
                },
                {
                  step: "3",
                  content: "設定公司代表帳號及登入密碼，確保日後登入順暢。",
                  icon: AiOutlineCheckCircle,
                },
                {
                  step: "4",
                  content: "確認所有資訊無誤後提交申請，等待MeetSure審核通知。",
                  icon: AiOutlineUpload,
                },
              ].map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  p={4}
                  borderRadius="md"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "lg",
                    background: "#f0f0f0",
                  }}
                >
                  <Box
                    as="span"
                    animation="pulse 2s infinite"
                    style={{ display: "inline-block" }}
                  >
                    <item.icon color="#1A237E" size={36} style={{ marginRight: '16px' }} />
                  </Box>
                  <Flex align="center">
                    <Box
                      bg="#1A237E"
                      color="#ffffff"
                      fontWeight="bold"
                      borderRadius="full"
                      w={10}
                      h={10}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={4}
                      animation="bounce 1s ease"
                    >
                      {item.step}
                    </Box>
                    <Text fontSize="lg" color="#4A4A4A" animation="fadeIn 2s ease-in">
                      {item.content}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Stack>

            <Button
              color="#ffffff"
              bg="#1A237E"
              size="lg"
              px={8}
              borderRadius="16px"
              _hover={{ bg: "#303F9F", transform: "scale(1.05)" }}
              onClick={() => window.location.href = "http://localhost:3000/#/auth/company"}
              rightIcon={<AiOutlineArrowRight />}
            >
              前往公司帳號申請
            </Button>

          </Stack>
        </Box>



        <Box bg="#F4F6F9" py={12} px={{ base: 6, md: 12 }} w="100%">
          <Stack spacing={6} align="center" textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="#1A237E">方案說明</Text>
            <Text fontSize="lg" color="#4A4A4A">我們提供個人與公司方案，根據您的需求選擇最適合的計劃。</Text>
          </Stack>

          {/* 個人方案 */}
          <Box mt={8} w="100%">
            <Text textAlign="center" fontSize="2xl" fontWeight="bold" color="#1A237E" mb={4}>個人方案</Text>
            <Flex wrap="wrap" justify="center" gap={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
              {[
                ["一般用戶", "100分鐘/月", "免費用量", "#1A237E", "/register", AiOutlineProfile],
                ["付費用戶", "600元/月", "用量12小時", "#FF4081", "/register", AiOutlineDollarCircle]
              ].map(([title, price, time, color, link, IconComp], index) => (
                <Box
                  key={index}
                  bg="#ffffff"
                  borderRadius="lg"
                  boxShadow="md"
                  p={8}
                  textAlign="center"
                  w={{ base: "100%", md: "30%" }}
                  transition="all 0.3s ease"
                  _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
                >
                  <Flex justify="center" align="center" mb={2}>
                    <Icon as={IconComp} color={color} w={6} h={6} mr={2} />
                    <Text fontSize="xl" fontWeight="bold" color={color}>{title}</Text>
                  </Flex>
                  <Text fontSize="lg" color="#4A4A4A" mt={2}>{price}</Text>
                  <Text fontSize="md" color="#4A4A4A">{time}</Text>
                  <Button
                    mt={6}
                    color="#ffffff"
                    bg={color}
                    borderRadius="full"
                    _hover={{ bg: `${color} CC` }}
                    onClick={() => window.location.href = "http://localhost:3000/#/auth/signup"}
                  >
                    {index === 0 ? "註冊個人" : "升級方案"}
                  </Button>

                </Box>
              ))}
            </Flex>
          </Box>

          {/* 公司方案 */}
          <Box mt={12} w="100%">
            <Text textAlign="center" fontSize="2xl" fontWeight="bold" color="#1A237E" mb={4}>公司方案</Text>
            <Flex wrap="wrap" justify="center" gap={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
              {[
                ["MeetSurePlus", "1500元/5個帳號", "40小時/月", "#1A237E", "/register"],
                ["MeetSurePro", "4500元/15個帳號", "120小時/月", "#FF4081", "/register"]
              ].map(([title, price, time, color, link], index) => (
                <Box
                  key={index}
                  bg="#ffffff"
                  borderRadius="lg"
                  boxShadow="md"
                  p={8}
                  textAlign="center"
                  w={{ base: "100%", md: "30%" }}
                  transition="all 0.3s ease"
                  _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
                >
                  <Text fontSize="xl" fontWeight="bold" color={color}>{title}</Text>
                  <Text fontSize="lg" color="#4A4A4A" mt={2}>{price}</Text>
                  <Text fontSize="md" color="#4A4A4A">{time}</Text>
                  <Button
                    mt={6}
                    color="#ffffff"
                    bg={color}
                    borderRadius="full"
                    _hover={{ bg: `${color} CC` }}
                    onClick={() => window.location.href = "http://localhost:3000/#/auth/company"}
                  >
                    {index === 0 ? "註冊公司" : "升級方案"}
                  </Button>

                </Box>
              ))}
            </Flex >
          </Box >
        </Box >
      </Flex >
    </Flex >
  );
};

export default HomePage;