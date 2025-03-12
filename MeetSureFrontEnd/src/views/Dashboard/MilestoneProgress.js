import React, { useState } from "react";
import {
    useColorModeValue,
    Text, VStack, Divider, Box, Icon, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
} from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Card from "components/Card/Card.js";
import { ProjectTimelineComponent } from "./ProjectSetProgressBar"; // 引入里程碑頁面

const progressData = [
    { name: "已完成", value: 20, color: "teal" }, // 綠色
    { name: "未完成", value: 80, color: "#E0E0E0" }, // 灰色
];

const MilestoneProgress = () => {
    const cardBg = useColorModeValue("white", "gray.800");
    const { isOpen, onOpen, onClose } = useDisclosure(); // 控制 Modal 開關

    return (
        <VStack flex="2" spacing="6">
            {/* 🏆 里程碑 UI */}
            <Card w="100%" p="6" bg={cardBg} boxShadow="lg">
                <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold">專案里程碑</Text>
                    <Button size="sm" bg="#EDF2F7" onClick={onOpen} p="4">
                        VIEW ALL
                    </Button>
                </HStack>
                <Divider my="2" />
                <Box p="6" bg="#48B2DE" borderRadius="lg" boxShadow="md">
                    <HStack justify="space-between">
                        <Box>
                            <Text fontSize="lg" color="white" fontWeight="bold">建立目標</Text>
                            <Text fontSize="md" color="white" mt="2">Step: 專案事前準備</Text>
                        </Box>
                    </HStack>
                </Box>
            </Card>

            {/* 🎯 進度圓餅圖 */}
            <Card w="100%" p="8" bg={cardBg} boxShadow="lg">
                <Text fontSize="lg" fontWeight="bold">專案進度追蹤</Text>
                <Divider my="2" />

                <HStack spacing="8" justify="center">
                    {/* ⭕ Pie Chart */}
                    <PieChart width={200} height={200}>
                        <Pie
                            data={progressData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            dataKey="value"
                        >
                            {progressData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    {/* 📊 右側百分比資訊 */}
                    <VStack align="start" spacing="4">
                        {progressData.map((item, index) => (
                            <HStack key={index}>
                                <Box w="12px" h="12px" bg={item.color} borderRadius="full" />
                                <Text fontSize="md" fontWeight="bold">{item.name}：</Text>
                                <Text fontSize="md">{item.value}%</Text>
                            </HStack>
                        ))}
                    </VStack>
                </HStack>
            </Card>

            {/* 🔹 里程碑 Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mt="6" mb="6">
                        <ProjectTimelineComponent /> {/* **只顯示時間軸** */}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default MilestoneProgress;
