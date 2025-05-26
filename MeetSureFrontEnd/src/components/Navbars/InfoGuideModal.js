import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  Icon,
  Image,
  Box,
} from "@chakra-ui/react";
import { FaTasks, FaFileAlt, FaBell, FaPenFancy, FaRobot } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ✅ 匯入圖片
import teach1 from "assets/img/teach1.png";
import teach2 from "assets/img/teach2.png";
import teach3 from "assets/img/teach3.png";
import teach4 from "assets/img/teach4.png";
import teach5 from "assets/img/teach5.png";
import teach6 from "assets/img/teach6.png";
import teach7 from "assets/img/teach7.png";
import teach8 from "assets/img/teach8.png";
import teach9 from "assets/img/teach9.png";
import teach10 from "assets/img/teach10.png";
import teach11 from "assets/img/teach11.png";

export default function InfoGuideModal({ isOpen, onClose }) {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const recommendations = {
    "manage-project": {
      title: "推薦：專案管理模組",
      description: "從建立專案、安排會議、指派任務，一步步掌握團隊進度。",
    },
    "get-meeting-summary": {
      title: "推薦：Speech To Text 模組",
      description: "上傳音檔，快速生成逐字稿與 AI 重點摘要，提升會議紀錄效率。",
    },
    "stay-updated": {
      title: "推薦：LINE Bot 即時通知",
      description: "綁定 LINE，隨時接收任務提醒、會議通知，不漏接任何重要資訊。",
    },
    "boost-writing": {
      title: "推薦：AI 工具",
      description: "使用 GPT聊天室、AI 寫作、翻譯、語法修正功能，加速文件處理與溝通。",
    },
    "ask-for-help": {
      title: "推薦：MeetSure 聊天機器人",
      description: "有問題？直接詢問 MeetSure 機器人或是選擇你所遇到的問題，獲得即時協助與操作引導。",
    },
  };

  const boostImages = [teach1, teach2, teach3, teach4];
  const progressImages = [teach6, teach7, teach8, teach9];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const handleBack = () => {
    setSelectedGoal(null);
  };

  const renderImageSection = (img, title, description, height = "400px") => (
    <Box w="100%" maxW="700px" mb={8} textAlign="center" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={2}>{title}</Text>
      <Image
        src={img}
        alt={title}
        borderRadius="lg"
        w="100%"
        h={height}
        objectFit="contain"
        boxShadow="md"
        mb={4}
      />
      <Text fontSize="md" color="gray.600">{description}</Text>
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl" motionPreset="scale">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" p={6}>
        <ModalHeader fontSize="3xl" fontWeight="bold" textAlign="center">
          {selectedGoal ? "" : "歡迎使用 MeetSure"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!selectedGoal ? (
            <Flex direction="column" align="center" textAlign="center">
              <Text fontSize="lg" fontWeight="medium" mb={8} color="gray.700">
                選擇你目前想解決的問題，讓我們推薦您最適合的功能模組！
              </Text>
              <Flex direction="row" justify="center" align="center" gap={8} wrap="nowrap">
                {[
                  { key: "manage-project", label: "管理專案", icon: FaTasks },
                  { key: "get-meeting-summary", label: "整理會議", icon: FaFileAlt },
                  { key: "stay-updated", label: "掌握進度", icon: FaBell },
                  { key: "boost-writing", label: "提升寫作", icon: FaPenFancy },
                  { key: "ask-for-help", label: "操作協助", icon: FaRobot },
                ].map((item) => (
                  <Flex
                    key={item.key}
                    direction="column"
                    align="center"
                    cursor="pointer"
                    onClick={() => setSelectedGoal(item.key)}
                  >
                    <Flex
                      transition="all 0.3s ease"
                      _hover={{ transform: "translateY(-5px) scale(1.1)" }}
                    >
                      <Icon as={item.icon} boxSize={12} color="teal.400" mb={2} />
                    </Flex>
                    <Text fontWeight="bold" fontSize="md" color="gray.700" mt={1}>
                      {item.label}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          ) : (
            <Flex direction="column" align="center" textAlign="center">
              {/* 單張模組：管理專案 */}
              {selectedGoal === "manage-project" &&
                renderImageSection(
                  teach11,
                  recommendations[selectedGoal].title,
                  recommendations[selectedGoal].description,
                  "550px"
                )}

              {/* 單張模組：整理會議 */}
              {selectedGoal === "get-meeting-summary" &&
                renderImageSection(
                  teach10,
                  recommendations[selectedGoal].title,
                  recommendations[selectedGoal].description,
                  "700px"
                )}

              {/* 幻燈片模組：掌握進度 */}
              {selectedGoal === "stay-updated" && (
                <Box w="100%" maxW="800px" mb={8}>
                  <Slider {...sliderSettings}>
                    {progressImages.map((img, idx) => (
                      <Box key={idx} textAlign="center" p={4}>
                        <Text fontSize="2xl" fontWeight="bold" mb={2}>
                          {recommendations[selectedGoal].title}
                        </Text>
                        <Image
                          src={img}
                          alt={`progress-slide-${idx}`}
                          borderRadius="lg"
                          w="100%"
                          h="400px"
                          objectFit="contain"
                          boxShadow="md"
                          mb={4}
                        />
                        <Text fontSize="md" color="gray.600">
                          {recommendations[selectedGoal].description}
                        </Text>
                      </Box>
                    ))}
                  </Slider>
                </Box>
              )}

              {/* 幻燈片模組：AI 工具 */}
              {selectedGoal === "boost-writing" && (
                <Box w="100%" maxW="800px" mb={8}>
                  <Slider {...sliderSettings}>
                    {boostImages.map((img, idx) => (
                      <Box key={idx} textAlign="center" p={4}>
                        <Text fontSize="2xl" fontWeight="bold" mb={2}>
                          {recommendations[selectedGoal].title}
                        </Text>
                        <Image
                          src={img}
                          alt={`boost-slide-${idx}`}
                          borderRadius="lg"
                          w="100%"
                          h="500px"
                          objectFit="cover"
                          boxShadow="md"
                          mb={4}
                        />
                        <Text fontSize="md" color="gray.600">
                          {recommendations[selectedGoal].description}
                        </Text>
                      </Box>
                    ))}
                  </Slider>
                </Box>
              )}

              {/* 單張模組：操作協助 */}
              {selectedGoal === "ask-for-help" &&
                renderImageSection(
                  teach5,
                  recommendations[selectedGoal].title,
                  recommendations[selectedGoal].description,
                  "320px"
                )}

              <Button
                onClick={handleBack}
                variant="outline"
                colorScheme="teal"
                borderRadius="full"
                mb={4}
              >
                ← 返回選擇其他需求
              </Button>
            </Flex>
          )}
        </ModalBody>
        <ModalFooter justifyContent="center" />
      </ModalContent>
    </Modal>
  );
}