import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Box,
  Image,
  IconButton,
  Flex,
  HStack,
  Circle,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import MeetSureLogo from "assets/img/MeetSureLogo.png";
import Step1 from "assets/img/Step1.png";
import Step2 from "assets/img/Step2.jpg";
import Step3 from "assets/img/Step3.png";
import Step4 from "assets/img/Step4.jpg";
import Step5 from "assets/img/Step5.png";
import Step6 from "assets/img/Step6.png";
import Step7 from "assets/img/Step7.png";
import Step8 from "assets/img/Step8.png";
import projecthelp from "assets/img/projecthelp.png";

function ProjectHelpModal({ isOpen, onClose }) {
  const steps = [
    {
      title: "歡迎使用MeetSure專案管理",
      content:
        "這裡可以管理您的專案會議排程、里程碑與待辦事項以及進度追蹤。點擊下一步了解更多～",
      image: projecthelp,
    },
   
    {
      title: "會議排程",
      content: "可查看會議時間與內容，點擊紅框標示處可新增會議。點擊藍框標示處可修改或刪除該會議",
      image: Step1,
    },
    {
        title: "會議排程-操作",
        content: "輸入會議相關資訊即可新增會議。",
        image: Step2,
      },
    {
      title: "待辦事項",
      content: "可查看或標記專案內所有組員之待辦事項。點擊『＋』新增待辦事項。",
      image: Step3,

    },
    {
        title: "待辦事項-操作",
        content: "建立分派任務給組員。",
        image: Step4,
  
      },
    {
      title: "專案進度圖",
      content: "點擊『完成任務』可更新里程碑進度。",
      image: Step5,

    },
    {
        title: "專案會議分析",
        content: "可查看歷史分析之會議記錄，點擊『上傳會議記錄』進行分析。",
        image: Step6,
  
      },
      {
        title: "專案會議分析-操作",
        content: "輸入對應資料上傳會議記錄進行分析。",
        image: Step7,
  
      },
      {
        title: "專案甘特圖",
        content: "查看專案任務進度階段。",
        image: Step8,
  
      },
  ];

  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent p={4} borderRadius="25px" minH="480px">
      <ModalHeader>
  <HStack spacing={3} align="center">
    <Image
      src={MeetSureLogo}
      alt="MeetSure Logo"
      height="28px"
      objectFit="contain"
    />
    <Text fontWeight="bold" fontSize="xl">
      {steps[step].title} {/* ← 這裡改成動態標題 */}
    </Text>
  </HStack>
</ModalHeader>




        <ModalCloseButton />
        <ModalBody>
          {/* 內容區塊：左右結構 */}
          <Flex align="center" justify="center" direction="row" gap="6">
            {/* 左圖 */}
            {steps[step].image && (
              <Box w="50%">
              <Image
  src={steps[step].image}
  alt={steps[step].title}
  borderRadius="lg"
  h="240px"
  objectFit="contain"
  boxShadow="md"
  mx="auto"
/>

              </Box>
            )}

            {/* 右文 */}
            <Box w="50%">
              <Text fontSize="md" textAlign="left">
                {steps[step].content}
              </Text>
            </Box>
          </Flex>

          {/* 🔘 點擊式進度圓點 */}
          <HStack justify="center" mt={6}>
            {steps.map((_, index) => (
              <Circle
                key={index}
                size="12px"
                cursor="pointer"
                transition="all 0.2s"
                bg={index === step ? "teal.500" : "gray.300"}
                _hover={{
                  bg: index === step ? "teal.600" : "gray.400",
                }}
                onClick={() => setStep(index)}
              />
            ))}
          </HStack>
        </ModalBody>

        {/* ⬅️➡️底部控制 */}
        <ModalFooter justifyContent="space-between">
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => setStep(step - 1)}
            isDisabled={isFirst}
            aria-label="上一步"
            variant="outline"
          />
          {!isLast ? (
            <IconButton
              icon={<ArrowForwardIcon />}
              onClick={() => setStep(step + 1)}
              aria-label="下一步"
              colorScheme="teal"
            />
          ) : (
            <Button colorScheme="teal" onClick={onClose}>
              完成導覽
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ProjectHelpModal;
