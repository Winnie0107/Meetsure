import React, { useEffect, useState } from "react";
import {
    useColorModeValue,
    Text,
    VStack,
    Divider,
    Box,
    HStack,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Icon,
} from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { MdSend } from "react-icons/md";
import Card from "components/Card/Card.js";
import { ProjectTimelineComponent } from "./ProjectSetProgressBar";
import { useParams } from "react-router-dom";
import axios from "axios";

// **專案任務的排序**
const taskOrder = [
    "設定專案目標", "完成需求分析", "技術架構確認", "專案初版計畫書", "專案計畫介紹PPT",
    "介面設計 (UI/UX)", "完成後端連接", "專案完整計畫書", "系統測試",
    "客戶驗收", "專案摘要與總體分析報告", "AI 支援建議", "正式上線"
];

// **專案任務的分類**
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

// **專案類別的顏色**
const categoryColors = {
    "專案事前準備": "#48B2DE",
    "專案進行中": "#E57872",
    "專案完成後": "#47B0AA"
};

const MilestoneProgress = () => {
    const { id: projectId } = useParams();
    const cardBg = useColorModeValue("white", "gray.800");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [tasks, setTasks] = useState([]);
    const [progressStats, setProgressStats] = useState({ done: 0, doing: 0, todo: 0 });
    const [milestoneTask, setMilestoneTask] = useState(null);

    // **取得專案任務**
    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/`);
            let projectTasks = res.data.tasks || [];

            // **按照 `taskOrder` 來排序**
            projectTasks = projectTasks.sort((a, b) => taskOrder.indexOf(a.name) - taskOrder.indexOf(b.name));

            // **計算進度**
            const doneTasks = projectTasks.filter(t => t.completed);
            const notDoneTasks = projectTasks.filter(t => !t.completed);

            // **設定 "進行中"（最小排序且未完成的任務）**
            const inProgressTask = notDoneTasks.length ? notDoneTasks[0] : null;
            setMilestoneTask(inProgressTask);

            // **計算進度百分比**
            const total = projectTasks.length;
            const done = doneTasks.length;
            const doing = inProgressTask ? 1 : 0; // 只取一個 "進行中"
            const todo = total - done - doing;

            setProgressStats({
                done: Math.round((done / total) * 100) || 0,
                doing: Math.round((doing / total) * 100) || 0,
                todo: Math.round((todo / total) * 100) || 0,
            });

            setTasks(projectTasks);
            setSelectedTasks(projectTasks.map(task => task.name));
        } catch (err) {
            console.error("❌ 取得任務失敗:", err);
        }
    };

    // **標記任務為完成**
    const handleCompleteTask = async () => {
        if (!milestoneTask || !milestoneTask.id) {
            console.error("❌ 任務 ID 未定義");
            return;
        }

        try {
            await axios.put(`http://127.0.0.1:8000/api/tasks/${milestoneTask.id}/complete/`);
            console.log(`✅ 任務 ${milestoneTask.name} 已標記為完成`);
            fetchTasks(); // 重新載入任務
        } catch (error) {
            console.error("❌ 無法完成任務:", error);
        }
    };

    // **顯示完整里程碑進度**
    const [selectedTasks, setSelectedTasks] = useState([]);



    const progressData = [
        { name: "已完成", value: progressStats.done, color: "teal" },
        { name: "進行中", value: progressStats.doing, color: "#90CDF4" },
        { name: "未完成", value: progressStats.todo, color: "#E0E0E0" },
    ];

    return (
        <VStack flex="2" spacing="6">
            {/* 🏆 里程碑 UI */}
            <Card w="100%" p="6" bg={cardBg} boxShadow="lg">
                <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold">專案里程碑</Text>
                    <HStack
                        spacing={2}
                        cursor="pointer"
                        onClick={onOpen}
                        px={3}
                        py={2}
                        borderRadius="md"
                        _hover={{ bg: "#E2E8F0" }}
                    >
                        <Text fontWeight="bold" color="blue.500">VIEW ALL</Text>
                        <Icon as={MdSend} color="blue.500" boxSize={4} />
                    </HStack>
                </HStack>
                <Divider my="2" />
                {milestoneTask ? (
                    <HStack spacing={4} align="center">
                        <Box flex="3" p="5" bg={categoryColors[taskCategoryMap[milestoneTask.name]] || "gray.300"} borderRadius="lg" boxShadow="md">
                            <Text fontSize="lg" color="white" fontWeight="bold">{milestoneTask.name}</Text>
                            <Text fontSize="md" color="white" mt="2">
                                Step: {taskCategoryMap[milestoneTask.name] || "未分類"}
                            </Text>
                        </Box>

                        <VStack flex="1" spacing={3}>
                            <Button
                                bg="#EDF2F7"
                                color="black"
                                _hover={{ bg: "#E2E8F0" }}
                                width="100%"
                            >
                                AI 輔助
                            </Button>
                            <Button
                                bg="#EDF2F7"
                                color="black"
                                _hover={{ bg: "#E2E8F0" }}
                                width="100%"
                                onClick={handleCompleteTask} // 🔥 點擊時更新任務狀態
                            >
                                完成任務
                            </Button>
                        </VStack>
                    </HStack>
                ) : (
                    <Text fontSize="sm" color="gray.500">所有任務皆已完成！</Text>
                )}
            </Card>

            {/* 🎯 進度圓餅圖 */}
            <Card w="100%" p="8" bg={cardBg} boxShadow="lg">
                <Text fontSize="lg" fontWeight="bold">專案進度追蹤</Text>
                <Divider my="2" />
                <HStack spacing="8" justify="center">
                    {/* ⭕ Pie Chart */}
                    <PieChart width={200} height={200}>
                        <Pie data={progressData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                            {progressData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    {/* 📊 右側百分比資訊 - **確保顯示** */}
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
                <ModalContent p={4} borderRadius="25px">
                    <ModalCloseButton mt="4" mr="4"/>
                    <ModalBody mt="6" mb="6">
                        <ProjectTimelineComponent selectedTasks={selectedTasks} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>

    );
};

export default MilestoneProgress;
