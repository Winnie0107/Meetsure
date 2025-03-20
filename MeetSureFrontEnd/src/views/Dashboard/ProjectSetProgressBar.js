import React, { useState, useEffect } from "react";
import axios from "axios";
import { useColorModeValue, Box, Text, Button, Flex } from "@chakra-ui/react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTasks, FaCheckCircle, FaUsers } from "react-icons/fa";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";

const categoryColors = {
    "專案事前準備": "#48B2DE",
    "專案進行中": "#E57872",
    "專案完成後": "#47B0AA"
};

// **🚀 獨立的里程碑時間軸元件**
export const ProjectTimelineComponent = ({ selectedTasks }) => {
    // 🏆 **任務與類別的對應**
    const taskCategoryMap = {
        "設定專案目標": "專案事前準備",
        "完成需求分析": "專案事前準備",
        "技術架構確認": "專案事前準備",
        "專案初版計畫書": "專案事前準備",
        "專案計畫介紹PPT": "專案事前準備",
        "介面設計 (UI/UX)": "專案進行中",
        "完成後端連接": "專案進行中",
        "專案完整計畫書": "專案進行中",
        "系統測試": "專案進行中",
        "客戶驗收": "專案完成後",
        "專案摘要與總體分析報告": "專案完成後",
        "AI 支援建議": "專案完成後",
        "正式上線": "專案完成後",
    };

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
                    {selectedTasks.map((task, index) => {
                        const category = taskCategoryMap[task] || "專案事前準備"; // 預設分類為 "專案事前準備"

                        return (
                            <VerticalTimelineElement
                                key={index}
                                contentStyle={{ background: categoryColors[category], color: "#fff" }}
                                contentArrowStyle={{ borderRight: `10px solid ${categoryColors[category]}` }}
                                iconStyle={{ background: categoryColors[category], color: "#fff" }}
                                icon={category === "專案完成後" ? <FaCheckCircle /> : <FaTasks />}
                            >
                                <Text sx={{ fontSize: "18px !important", fontWeight: "bold !important" }}>
                                    {task}
                                </Text>
                                <Text fontSize="sm">Step: {category}</Text>
                            </VerticalTimelineElement>
                        );
                    })}
                </VerticalTimeline>
            </Box>
        </Box>
    );
};

// **🚀 ProjectTimeline - 主要元件**
const ProjectTimeline = ({ handleStepClick, projectData, handleSubmit }) => {
    const textColor = useColorModeValue("gray.700", "white");

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="0px" width="100%">
            {/* 步驟條 */}
            <Flex width="100%" bg="gray.100" p={2} borderRadius="md" mb={4} justify="center">
                {[1, 2, 3, 4].map((num) => (
                    <Box
                        key={num}
                        flex="1"
                        textAlign="center"
                        p={3}
                        fontWeight="bold"
                        bg={num === 4 ? "white" : "gray.200"}
                        color={num === 4 ? "black" : "gray.500"}
                        borderRadius="md"
                        mx={1}
                        cursor="pointer"
                        onClick={() => handleStepClick(num)}
                    >
                        Step {num}
                    </Box>
                ))}
            </Flex>

            {/* 主要內容 */}
            <Flex direction="row" gap="24px">
                <Box w="100%">
                    <Card my="22px" w="100%" pb="10px" height="auto">
                        <CardHeader p="6px 0px 22px 16px">
                            <Flex justify="space-between" alignItems="center">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    Step.4 設定專案進度
                                </Text>
                                <Button colorScheme="teal" onClick={() => {
                                    console.log("📢 `開始管理專案` 按鈕被點擊！");
                                    handleSubmit();
                                }}>
                                    開始管理專案
                                </Button>
                            </Flex>
                        </CardHeader>

                        {/* 🚀 時間軸元件 */}
                        <ProjectTimelineComponent selectedTasks={projectData.selectedTasks} />
                    </Card>
                </Box>
            </Flex>
        </Flex>
    );
};

export default ProjectTimeline;
