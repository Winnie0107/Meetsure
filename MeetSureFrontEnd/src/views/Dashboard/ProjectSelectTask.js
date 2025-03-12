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
    Input,
} from "@chakra-ui/react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { MdOutlineMeetingRoom, MdOutlineWorkOutline, MdOutlineCelebration } from "react-icons/md";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import ProjectImage from "assets/img/Project.png";

function ProjectSelectTask({ onSetProgressBar }) {
    const [step, setStep] = useState(0);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [meetingCount, setMeetingCount] = useState("");
    const textColor = useColorModeValue("gray.700", "white");
    const totalSteps = 3;

    const stepIcons = [MdOutlineMeetingRoom, MdOutlineWorkOutline, MdOutlineCelebration];

    const steps = [
        {
            title: "專案事前準備",
            tasks: [
                "設定專案目標",
                "完成需求分析",
                "技術架構確認",
                "專案初版計畫書",
                "專案計畫介紹PPT",
            ],
            image: ProjectImage, // 每個步驟都有一個圖片
        },
        {
            title: "專案進行過程",
            tasks: [
                "介面設計 (UI/UX)",
                "完成後端連接",
                "專案完整計畫書",
                "系統測試",
            ],
            image: ProjectImage,
        },
        {
            title: "專案完成後",
            tasks: [
                "客戶驗收",
                "專案摘要與總體分析報告",
                "AI 支援建議",
                "正式上線",
            ],
            image: ProjectImage,
        },
    ];

    const handleNextStep = () => {
        if (step < totalSteps - 1) setStep(step + 1);
    };

    const handlePreviousStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleCheckboxChange = (task) => {
        setSelectedTasks((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    };


    // 定義浮動動畫
    const floatAnimation = keyframes`
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
    `;

    const [projectStep] = useState(3);

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="0px" width="100%">
            {/* 步驟指示條 */}
            <Flex width="100%" bg="gray.100" p={2} borderRadius="md" mb={4} justify="center">
                {[1, 2, 3, 4].map((num) => (
                    <Box
                        key={num}
                        flex="1"
                        textAlign="center"
                        p={3}
                        fontWeight="bold"
                        bg={projectStep === num ? "white" : "gray.200"}
                        color={projectStep === num ? "black" : "gray.500"}
                        borderRadius="md"
                        transition="0.3s"
                        mx={1} // 讓步驟之間有一點間隔
                    >
                        Step {num}
                    </Box>
                ))}
            </Flex>

            {/* 主要內容區域，包含兩個 Card */}
            <Flex direction="row" gap="24px">
                <Card my="22px" w="75%" pb="0px" height="700px">
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
                                    colorScheme="teal"
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
                                            color={step >= index ? "teal.500" : "gray.300"}
                                        />
                                    ))}
                                </Flex>
                            </Box>
                            <Box
                                width="100%"
                                maxWidth="95%"
                                height="430px"
                                p="8"
                                borderRadius="xl"
                                boxShadow="lg"
                                bg={useColorModeValue("white", "gray.700")}
                                position="relative"
                            >
                                <Flex align="center" mb="4">
                                    <Icon as={stepIcons[step]} boxSize="10" color="teal.500" mr="4" />
                                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                        {steps[step].title}
                                    </Text>
                                </Flex>

                                {/* 使用 Flex 容器並排 CheckboxGroup 和圖片 */}
                                <Flex direction="row" align="start" justify="space-between">
                                    {/* CheckboxGroup 占左邊 */}
                                    <Box flex="1" pl="2" pt="3">
                                        <CheckboxGroup>
                                            <VStack spacing="6" align="start">
                                                {steps[step].tasks.map((task, index) => (
                                                    <Checkbox
                                                        key={index}
                                                        size="lg"
                                                        colorScheme="teal"
                                                        isChecked={selectedTasks.includes(task)}
                                                        onChange={() => handleCheckboxChange(task)}
                                                    >
                                                        {task}
                                                    </Checkbox>
                                                ))}
                                            </VStack>
                                        </CheckboxGroup>
                                    </Box>

                                    {/* 圖片占右邊 */}
                                    <Box flex="1" mr="4" display="flex" justifyContent="flex-end" transform="translateY(-60px)">
                                        <Image
                                            src={ProjectImage}
                                            alt="流程圖片"
                                            maxWidth="100%"  // 设置图片的最大宽度
                                            borderRadius="lg"
                                            animation={`${floatAnimation} 4s ease-in-out infinite`}
                                            boxSize="95%" // 调整图片大小
                                        />
                                    </Box>

                                </Flex>

                                {/* 固定在底部的導航按鈕 */}
                                <Box position="absolute" bottom="8" width="90%" mt="4">
                                    <Flex justify="space-between">
                                        <Button
                                            onClick={handlePreviousStep}
                                            isDisabled={step === 0}
                                            colorScheme="teal"
                                            variant="outline"
                                        >
                                            上一步
                                        </Button>
                                        <Button
                                            onClick={handleNextStep}
                                            isDisabled={step === totalSteps - 1}
                                            colorScheme="teal"
                                        >
                                            下一步
                                        </Button>
                                    </Flex>
                                </Box>
                            </Box>
                        </Box>
                    </Flex>
                </Card>
                <Card my="22px" w="25%" height="700px" position="relative">
                    {/* 顯示已勾選的任務 */}
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        已選擇的任務
                    </Text>
                    <VStack spacing="4" mt="6" align="start">
                        {selectedTasks.map((task, index) => (
                            <Flex key={index} align="center">
                                <Icon as={FiCheckCircle} boxSize="5" color="teal.500" mr="4" />
                                <Text fontSize="lg" color={textColor}>
                                    {task}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>

                    {/* 置底的 "開始設定專案進度條" 按鈕 */}
                    <Box position="absolute" bottom="24px" left="50%" transform="translateX(-50%)" textAlign="center">
                        <Button
                            colorScheme="teal"
                            size="lg"
                            onClick={onSetProgressBar}
                        >
                            開始設定專案進度條
                        </Button>
                    </Box>
                </Card>
            </Flex>
        </Flex>
    );
}

export default ProjectSelectTask;
