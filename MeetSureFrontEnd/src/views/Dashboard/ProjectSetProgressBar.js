import React, { useState } from "react";
import { useColorModeValue, Box, Text, Button, Flex, HStack, Circle } from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";

function ProjectSetProgressBar({ onStart }) {
    const textColor = useColorModeValue("gray.700", "white");

    // 假设这些是项目的任务项
    const [tasks, setTasks] = useState([
        { name: "確認人員", time: "2024-12-01", progress: 20, category: "準備" },
        { name: "建立目標", time: "2024-12-05", progress: 40, category: "準備" },
        { name: "專案初版計畫書", time: "2024-12-05", progress: 40, category: "準備" },
        { name: "繳交進度文件", time: "2024-12-10", progress: 60, category: "進行中" },
        { name: "第一次會議", time: "2024-12-15", progress: 80, category: "進行中" },
        { name: "第二次會議", time: "2024-12-15", progress: 80, category: "進行中" },
        { name: "第三次會議", time: "2024-12-15", progress: 80, category: "進行中" },
        { name: "系統測試", time: "2024-12-20", progress: 100, category: "進行中" },
        { name: "專案摘要與總體分析報告", time: "2024-12-20", progress: 100, category: "完成" },
        { name: "AI支援建議", time: "2024-12-20", progress: 100, category: "完成" },
    ]);

    // 根据任务的类别分类
    const categories = {
        準備: tasks.filter((task) => task.category === "準備"),
        進行中: tasks.filter((task) => task.category === "進行中"),
        完成: tasks.filter((task) => task.category === "完成"),
    };

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} mx="auto">
            {/* 專案介绍卡片 */}
            <Card my="22px" w="100%" height="auto" boxShadow="lg" >
                <CardHeader p="6px 0px 22px 16px">
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        Step.4 開始設定專案進度條
                    </Text>
                </CardHeader>

                {/* 时间线展示 */}
                <Box mt="8" p="20px">
                    <HStack spacing={8} justify="space-between" align="flex-start">
                        {/* 专案事前準備区 */}
                        <Box width="28%" bg="gray.100" p="6" borderRadius="lg" minHeight="300px">
                            <Text fontWeight="bold" color={textColor} mb="4" fontSize="lg" textAlign="center">
                                專案事前準備
                            </Text>
                            {categories.準備.map((task) => (
                                <HStack key={task.name} spacing={4} align="center" mb="4">
                                    {/* 左側的圓點 */}
                                    <Circle size="8px" bg="green.400" />
                                    <Box p="4" bg="white" borderRadius="lg" flex="1">
                                        <Text fontWeight="bold">{task.name} - {task.time}</Text>
                                        <Text>進度: {task.progress}%</Text>
                                    </Box>
                                </HStack>
                            ))}
                        </Box>

                        {/* 专案進行中区 */}
                        <Box width="28%" bg="gray.100" p="6" borderRadius="lg" minHeight="300px">
                            <Text fontWeight="bold" color={textColor} mb="4" fontSize="lg" textAlign="center">
                                專案進行過程
                            </Text>
                            {categories.進行中.map((task) => (
                                <HStack key={task.name} spacing={4} align="center" mb="4">
                                    {/* 左側的圓點 */}
                                    <Circle size="8px" bg="green.400" />
                                    <Box p="4" bg="white" borderRadius="lg" flex="1">
                                        <Text fontWeight="bold">{task.name} - {task.time}</Text>
                                        <Text>進度: {task.progress}%</Text>
                                    </Box>
                                </HStack>
                            ))}
                        </Box>

                        {/* 专案完成後区 */}
                        <Box width="28%" bg="gray.100" p="6" borderRadius="lg" minHeight="300px">
                            <Text fontWeight="bold" color={textColor} mb="4" fontSize="lg" textAlign="center">
                                專案完成後
                            </Text>
                            {categories.完成.map((task) => (
                                <HStack key={task.name} spacing={4} align="center" mb="4">
                                    {/* 左側的圓點 */}
                                    <Circle size="8px" bg="green.400" />
                                    <Box p="4" bg="white" borderRadius="lg" flex="1">
                                        <Text fontWeight="bold">{task.name} - {task.time}</Text>
                                        <Text>進度: {task.progress}%</Text>
                                    </Box>
                                </HStack>
                            ))}
                        </Box>
                    </HStack>
                </Box>

                <Box mt="8" display="flex" justifyContent="center">
                    <Button colorScheme="teal" onClick={onStart}>
                        開始管理專案
                    </Button>
                </Box>
            </Card>
        </Flex>
    );
}

export default ProjectSetProgressBar;
