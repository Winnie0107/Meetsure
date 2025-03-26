import React, { useState } from "react";
import {
    Flex,
    Button,
    Text,
    Box,
    VStack,
    Progress,
    Icon,
    Checkbox,
    CheckboxGroup,
    useColorModeValue,
    Image,
    keyframes,
} from "@chakra-ui/react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { MdOutlineMeetingRoom, MdOutlineWorkOutline, MdOutlineCelebration } from "react-icons/md";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import ProjectImage from "assets/img/Project.png";

function ProjectSelectTask({ onSetProgressBar, handleStepClick, projectData, setProjectData }) {
    const [step, setStep] = useState(0);
    const selectedTasks = projectData.selectedTasks || [];
    const textColor = useColorModeValue("gray.700", "white");
    const totalSteps = 3;

    const stepIcons = [MdOutlineMeetingRoom, MdOutlineWorkOutline, MdOutlineCelebration];

    const steps = [
        {
            title: "專案事前準備",
            tasks: ["設定專案目標", "完成需求分析", "技術架構確認", "專案初版計畫書", "專案計畫介紹PPT"],
            image: ProjectImage,
            colorScheme: "blue",
        },
        {
            title: "專案進行過程",
            tasks: ["介面設計 (UI/UX)", "完成後端連接", "專案完整計畫書", "系統測試"],
            image: ProjectImage,
            colorScheme: "orange",
        },
        {
            title: "專案完成後",
            tasks: ["客戶驗收", "專案摘要與總體分析報告", "AI 支援建議", "正式上線"],
            image: ProjectImage,
            colorScheme: "green",
        },
    ];

    const handleNextStep = () => {
        if (step < totalSteps - 1) setStep(step + 1);
    };

    const handlePreviousStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleCheckboxChange = (task) => {
        setProjectData((prevData) => ({
            ...prevData,
            selectedTasks: prevData.selectedTasks.includes(task)
                ? prevData.selectedTasks.filter((t) => t !== task)
                : [...prevData.selectedTasks, task],
        }));
    };


    // 浮動動畫
    const floatAnimation = keyframes`
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
    `;

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="0px" width="100%">
            {/* 步驟條 - 點擊跳轉 */}
            <Flex width="100%" bg="gray.100" p={2} borderRadius="md" mb={4} justify="center">
                {[1, 2, 3, 4].map((num) => (
                    <Box
                        key={num}
                        flex="1"
                        textAlign="center"
                        p={3}
                        fontWeight="bold"
                        bg={num === 3 ? "white" : "gray.200"}
                        color={num === 3 ? "black" : "gray.500"}
                        borderRadius="md"
                        mx={1}
                        cursor="pointer"
                        onClick={() => handleStepClick(num)}
                    >
                        Step {num}
                    </Box>
                ))}
            </Flex>

            {/* 主要內容區域 */}
            <Flex direction="row" gap="24px">
                {/* ✅ 左側主要區域 */}
                <Card my="22px" w="70%" pb="0px" height="750px">
                    <CardHeader p="6px 0px 22px 16px">
                        <Flex justify="space-between" alignItems="center">
                            <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                Step.3 選擇我的專案任務
                            </Text>
                        </Flex>
                    </CardHeader>

                    <Flex direction="row" alignItems="flex-start" height="100%" mt="5">
                        {/* 流程部分 */}
                        <Box flex="3" pl="4" height="100%" overflow="auto">
                            <Box width="100%" maxWidth="95%" mb="8">
                                <Progress
                                    value={(step + 1) / totalSteps * 100}
                                    size="sm"
                                    colorScheme={steps[step].colorScheme}
                                    borderRadius="md"
                                    hasStripe
                                    isAnimated
                                />
                                <Flex justify="space-between" mt="2">
                                    {steps.map((_, index) => (
                                        <Icon
                                            key={index}
                                            as={step >= index ? FiCheckCircle : FiCircle}
                                            boxSize="8"
                                            color={step >= index ? steps[index].colorScheme + ".500" : "gray.300"}
                                        />
                                    ))}
                                </Flex>
                            </Box>

                            <Box
                                width="100%"
                                maxWidth="95%"
                                height="480px"
                                p="8"
                                borderRadius="xl"
                                boxShadow="lg"
                                bg={useColorModeValue("white", "gray.700")}
                                position="relative"
                            >
                                <Flex align="center" mb="4">
                                    <Icon as={stepIcons[step]} boxSize="10" color={steps[step].colorScheme + ".500"} mr="4" />
                                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                        {steps[step].title}
                                    </Text>
                                </Flex>

                                {/* 使用 Flex 容器並排 CheckboxGroup 和圖片 */}
                                <Flex direction="row" align="start" justify="space-between">
                                    {/* ✅ CheckboxGroup 占左邊 */}
                                    <Box flex="1" pl="2" pt="3">
                                        <CheckboxGroup>
                                            <VStack spacing="6" align="start">
                                                {steps[step].tasks.map((task, index) => (
                                                    <Checkbox
                                                        key={index}
                                                        size="lg"
                                                        colorScheme={steps[step].colorScheme}
                                                        isChecked={selectedTasks.includes(task)}
                                                        onChange={() => handleCheckboxChange(task)}
                                                    >
                                                        {task}
                                                    </Checkbox>
                                                ))}
                                            </VStack>
                                        </CheckboxGroup>
                                    </Box>

                                    {/* ✅ 圖片占右邊 */}
                                    <Box flex="1" mr="4" display="flex" justifyContent="flex-end">
                                        <Image
                                            src={ProjectImage}
                                            alt="流程圖片"
                                            maxWidth="100%"
                                            borderRadius="lg"
                                            animation={`${floatAnimation} 4s ease-in-out infinite`}
                                            boxSize="95%"
                                        />
                                    </Box>
                                </Flex>

                                {/* ✅ 固定在底部的導航按鈕 */}
                                <Box position="absolute" bottom="8" width="90%" mt="4">
                                    <Flex justify="space-between">
                                        <Button
                                            onClick={handlePreviousStep}
                                            isDisabled={step === 0}
                                            colorScheme={steps[step].colorScheme}
                                            variant="outline"
                                        >
                                            上一步
                                        </Button>
                                        <Button
                                            onClick={handleNextStep}
                                            isDisabled={step === totalSteps - 1}
                                            colorScheme={steps[step].colorScheme}
                                        >
                                            下一步
                                        </Button>
                                    </Flex>
                                </Box>
                            </Box>
                        </Box>
                    </Flex>
                </Card>

                {/* ✅ 右側顯示已選擇的任務 + 「開始設定專案進度條」按鈕 */}
                <Card my="22px" w="30%" height="750px" display="flex" flexDirection="column" justifyContent="space-between">
                    <CardHeader>
                        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                            已選擇的任務
                        </Text>
                    </CardHeader>
                    <VStack spacing="4" mt="6" align="start" p="4" flex="1">
                        {selectedTasks.map((task, index) => (
                            <Flex key={index} align="center">
                                <Icon as={FiCheckCircle} boxSize="5" color="teal.500" mr="4" />
                                <Text fontSize="lg" color={textColor}>
                                    {task}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>

                    <Box textAlign="center" p="4">
                        <Button colorScheme="teal" size="lg" onClick={onSetProgressBar}>
                            開始設定專案進度條
                        </Button>
                    </Box>
                </Card>
            </Flex>
        </Flex>
    );
}

export default ProjectSelectTask;
