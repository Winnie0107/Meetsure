import React, { useState } from "react";
import { useColorModeValue, Box, Text, Button, Flex } from "@chakra-ui/react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTasks, FaCheckCircle, FaUsers } from "react-icons/fa";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { Link } from "react-router-dom";

// **專案里程碑資料**
const tasks = [
    { name: "確認人員", time: "2024-12-01", category: "專案事前準備", icon: <FaTasks /> },
    { name: "建立目標", time: "2024-12-05", category: "專案事前準備", icon: <FaTasks /> },
    { name: "專案初版計畫書", time: "2024-12-05", category: "專案事前準備", icon: <FaTasks /> },
    { name: "繳交進度文件", time: "2024-12-10", category: "專案進行中", icon: <FaUsers /> },
    { name: "系統測試", time: "2024-12-20", category: "專案進行中", icon: <FaUsers /> },
    { name: "專案摘要與總體分析報告", time: "2024-12-20", category: "專案完成後", icon: <FaCheckCircle /> },
    { name: "AI支援建議", time: "2024-12-20", category: "專案完成後", icon: <FaCheckCircle /> },
];

// **顏色對應不同類別**
const categoryColors = {
    "專案事前準備": "#48B2DE",
    "專案進行中": "#E57872",
    "專案完成後": "#47B0AA"
};

// **🚀 獨立的里程碑時間軸元件**
export const ProjectTimelineComponent = () => {
    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                專案里程碑
            </Text>
            <Box
                sx={{
                    ".vertical-timeline": { maxWidth: "100%", margin: "0 auto" },
                    ".vertical-timeline::before": { backgroundColor: "lightgrey !important", width: "5px !important" }
                }}
            >
                <VerticalTimeline className="vertical-timeline">
                    {tasks.map((task, index) => {
                        return (
                            <VerticalTimelineElement
                                key={index}
                                contentStyle={{ background: categoryColors[task.category], color: "#fff" }}
                                contentArrowStyle={{ borderRight: `10px solid ${categoryColors[task.category]}` }}
                                iconStyle={{ background: categoryColors[task.category], color: "#fff" }}
                                icon={task.icon}
                            >
                                {/* **強制字體大小和粗體** */}
                                <Text
                                    sx={{
                                        fontSize: "18px !important",  // 確保字體大小
                                        fontWeight: "bold !important" // 確保字體加粗
                                    }}
                                >
                                    {task.name}
                                </Text>
                                <Text fontSize="sm">Step: {task.category}</Text>
                            </VerticalTimelineElement>
                        );
                    })}
                </VerticalTimeline>
            </Box>
        </Box>
    );
};


// **完整的 ProjectTimeline.js**
const ProjectTimeline = ({ onStart }) => {
    const textColor = useColorModeValue("gray.700", "white");

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="0px" width="100%">
            <Flex width="100%" bg="gray.100" p={2} borderRadius="md" mb={4} justify="center">
                {[1, 2, 3, 4].map((num) => (
                    <Box key={num} flex="1" textAlign="center" p={3} fontWeight="bold"
                        bg={num === 4 ? "white" : "gray.200"} color={num === 4 ? "black" : "gray.500"}
                        borderRadius="md" transition="0.3s" mx={1}>
                        Step {num}
                    </Box>
                ))}
            </Flex>

            <Flex direction="row" gap="24px">
                <Box w="100%">
                    <Card my="22px" w="100%" pb="10px" height="auto">
                        <CardHeader p="6px 0px 22px 16px">
                            <Flex justify="space-between" alignItems="center">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    Step.4 設定專案進度
                                </Text>
                                <Box mt="4">
                                    <Link to="/admin/projectmanagement">
                                        <Button colorScheme="teal">開始管理專案</Button>
                                    </Link>
                                </Box>
                            </Flex>
                        </CardHeader>

                        {/* 🚀 使用獨立的時間軸元件 */}
                        <ProjectTimelineComponent />
                    </Card>
                </Box>
            </Flex>
        </Flex>
    );
};

export default ProjectTimeline;