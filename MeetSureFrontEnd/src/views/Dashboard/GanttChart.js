// ⚙️ 前面 import 都不變
import React, { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import "../../assets/css/frappe-gantt.css";
import {
    useColorModeValue,
    Box,
    Text,
    Divider,
    Spinner,
    Center,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    FormLabel,
    FormControl,
    ModalCloseButton,
    HStack,
    useToast,
    Select,
    Icon
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { useParams } from "react-router-dom";
import axios from "axios";

const GanttChart = () => {
    const ganttRef = useRef(null);
    const scrollRef = useRef(null);
    const isDraggingRef = useRef(false);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingUpdates, setPendingUpdates] = useState({});
    const { id: projectId } = useParams();
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("user_id");
    const cardBg = useColorModeValue("white", "gray.800");
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({
        name: "",
        start: "",
        end: "",
        progress: 0,
        dependencies: "",
    });

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${projectId}/gantt-tasks/`, {
                headers: { Authorization: `Token ${token}` },
            });
            const formatted = res.data.map((task) => ({
                ...task,
                id: String(task.id),
                start: String(task.start),
                end: String(task.end),
                dependencies: task.dependencies || "",
            }))
                .sort((a, b) => Number(a.id) - Number(b.id));
            ;
            setTasks(formatted);
        } catch (error) {
            console.error("❌ 載入失敗:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (ganttRef.current) {
                const savedScroll = scrollRef.current?.scrollLeft || 0;
                ganttRef.current.innerHTML = "";

                if (tasks.length > 0) {
                    const gantt = new Gantt(ganttRef.current, [...tasks], {
                        on_click: (task) => {
                            if (isDraggingRef.current) return;
                            const originalTask = tasks.find(t => t.id === task.id);
                            setSelectedTask(originalTask);
                            onOpen();
                        },
                        on_date_change: (task, start, end) => {
                            isDraggingRef.current = true;
                            setTimeout(() => (isDraggingRef.current = false), 300);
                            const original = tasks.find(t => t.id === task.id);
                            setPendingUpdates((prev) => ({
                                ...prev,
                                [task.id]: {
                                    ...original,
                                    start: start.toISOString().split("T")[0],
                                    end: end.toISOString().split("T")[0],
                                    dependencies: original.dependencies,
                                }
                            }));
                        },
                        on_progress_change: (task, progress) => {
                            isDraggingRef.current = true;
                            setTimeout(() => (isDraggingRef.current = false), 300);
                            const original = tasks.find(t => t.id === task.id);
                            setPendingUpdates((prev) => ({
                                ...prev,
                                [task.id]: {
                                    ...original,
                                    progress,
                                    dependencies: original.dependencies,
                                }
                            }));
                        },
                        view_mode: "Day",
                        language: "zh",
                    });

                    const applyProgressColors = () => {
                        setTimeout(() => {
                            document.querySelectorAll(".bar-progress").forEach((bar, index) => {
                                const p = tasks[index]?.progress || 0;
                                if (p <= 49) bar.style.fill = "#f9d6d5";
                                else if (p <= 70) bar.style.fill = "#fde6c6";
                                else bar.style.fill = "#d4f7dc";
                            });
                        }, 300);
                    };

                    applyProgressColors();
                    const observer = new MutationObserver(() => applyProgressColors());
                    observer.observe(ganttRef.current, { childList: true, subtree: true });

                    scrollRef.current.scrollLeft = savedScroll;

                    return () => observer.disconnect();
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [tasks]);

    const updateTask = async (taskId, updates) => {
        const payload = {
            ...updates,
            dependencies: Array.isArray(updates.dependencies)
                ? updates.dependencies.join(",")
                : updates.dependencies || "",
        };
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/gantt-tasks/${taskId}/update/`, payload, {
                headers: { Authorization: `Token ${token}` },
            });
            toast({ title: "更新成功", status: "success", isClosable: true });
            onClose();
            setSelectedTask(null);
            fetchTasks();
        } catch (err) {
            console.error("❌ 更新失敗:", err);
            toast({ title: "更新失敗", status: "error", isClosable: true });
        }
    };

    const saveAllPendingUpdates = async () => {
        const updatePromises = Object.entries(pendingUpdates).map(([taskId, data]) =>
            updateTask(taskId, data)
        );
        await Promise.all(updatePromises);
        toast({ title: "所有變更已儲存", status: "success", isClosable: true });
        setPendingUpdates({});
        fetchTasks();
    };

    const handleCreate = async () => {
        if (!newTask.name || !newTask.start || !newTask.end) {
            toast({ title: "請填寫所有欄位", status: "warning", isClosable: true });
            return;
        }
        try {
            const payload = {
                ...newTask,
                project: projectId,
                created_by: currentUserId,
                dependencies: newTask.dependencies || "",
            };
            await axios.post( `${process.env.REACT_APP_API_URL}/gantt-tasks/create/ `, payload, {
                headers: { Authorization: `Token ${token}` },
            });
            toast({ title: "新增成功", status: "success", isClosable: true });
            setNewTask({ name: "", start: "", end: "", progress: 0, dependencies: "" });
            onClose();
            fetchTasks();
        } catch (err) {
            toast({ title: "新增失敗", status: "error", isClosable: true });
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/gantt-tasks/${selectedTask.id}/delete/`, {
                headers: { Authorization: `Token ${token}` },
            });
            toast({ title: "任務已刪除", status: "info", isClosable: true });
            onClose();
            fetchTasks();
        } catch (err) {
            console.error("❌ 刪除失敗:", err);
        }
    };

    return (
        <Card bg={cardBg} p="6" boxShadow="lg">
            <CardHeader pb="4">
                <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold">專案甘特圖</Text>
                    <HStack>
                        <Icon
                            as={MdAdd}
                            boxSize={8}
                            color="teal.500"
                            cursor="pointer"
                            title="新增任務"
                            onClick={() => {
                                setSelectedTask(null);
                                onOpen();
                            }}
                        />
                        {Object.keys(pendingUpdates).length > 0 && (
                            <Button colorScheme="teal" size="sm" onClick={saveAllPendingUpdates}>
                                儲存日期變更（{Object.keys(pendingUpdates).length}）
                            </Button>
                        )}
                    </HStack>
                </HStack>
                <Divider my="2" />
                <Box fontSize="sm" color="gray.600" mb="2">
                    <Text>📌 點擊任務可進行編輯，拖曳任務可調整期間，記得點擊「儲存日期變更」!</Text>
                    <HStack spacing={4} mb={1}>
                        <HStack spacing={1}>
                            <Box w="14px" h="14px" bg="#f9d6d5" borderRadius="md" />
                            <Text> 進度 ≤ 49%</Text>
                        </HStack>
                        <HStack spacing={1}>
                            <Box w="14px" h="14px" bg="#fde6c6" borderRadius="md" />
                            <Text> 進度 50% - 70%</Text>
                        </HStack>
                        <HStack spacing={1}>
                            <Box w="14px" h="14px" bg="#d4f7dc" borderRadius="md" />
                            <Text> 進度 70%</Text>
                        </HStack>
                    </HStack>
                </Box>

            </CardHeader>

            <Box height="70vh" overflowX="auto" paddingBottom="20px" ref={scrollRef}>
                {loading ? (
                    <Center h="100%"><Spinner size="lg" /></Center>
                ) : (
                    <div ref={ganttRef}></div>
                )}
            </Box>

            <Modal isOpen={isOpen} onClose={() => {
                onClose();
                setSelectedTask(null);
            }}>
                <ModalOverlay />
                <ModalContent p={4} borderRadius="25px">
                    <ModalHeader>{selectedTask ? "任務詳情" : "新增任務"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb="3">
                            <FormLabel>任務名稱</FormLabel>
                            <Input
                                value={selectedTask?.name || newTask.name}
                                onChange={(e) =>
                                    selectedTask
                                        ? setSelectedTask({ ...selectedTask, name: e.target.value })
                                        : setNewTask({ ...newTask, name: e.target.value })
                                }
                            />
                        </FormControl>
                        <FormControl mb="3">
                            <FormLabel>開始日期</FormLabel>
                            <Input
                                type="date"
                                value={selectedTask?.start || newTask.start}
                                onChange={(e) =>
                                    selectedTask
                                        ? setSelectedTask({ ...selectedTask, start: e.target.value })
                                        : setNewTask({ ...newTask, start: e.target.value })
                                }
                            />
                        </FormControl>
                        <FormControl mb="3">
                            <FormLabel>結束日期</FormLabel>
                            <Input
                                type="date"
                                value={selectedTask?.end || newTask.end}
                                onChange={(e) =>
                                    selectedTask
                                        ? setSelectedTask({ ...selectedTask, end: e.target.value })
                                        : setNewTask({ ...newTask, end: e.target.value })
                                }
                            />
                        </FormControl>
                        <FormControl mb="3">
                            <FormLabel>完成進度 (%)</FormLabel>
                            <Input
                                type="number"
                                value={selectedTask?.progress ?? newTask.progress}
                                onChange={(e) =>
                                    selectedTask
                                        ? setSelectedTask({ ...selectedTask, progress: Number(e.target.value) })
                                        : setNewTask({ ...newTask, progress: Number(e.target.value) })
                                }
                            />
                        </FormControl>
                        <FormControl mt="3">
                            <FormLabel>依賴任務</FormLabel>
                            <Select
                                placeholder="無"
                                value={selectedTask?.dependencies || newTask.dependencies}
                                onChange={(e) =>
                                    selectedTask
                                        ? setSelectedTask({ ...selectedTask, dependencies: e.target.value })
                                        : setNewTask({ ...newTask, dependencies: e.target.value })
                                }
                            >
                                {tasks.map((task) => (
                                    <option key={task.id} value={task.id}>{task.name}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        {selectedTask ? (
                            <>
                                <Button colorScheme="red" mr={3} onClick={handleDelete}>刪除</Button>
                                <Button onClick={() => {
                                    const { id, name, start, end, progress, dependencies } = selectedTask;
                                    updateTask(id, { name, start, end, progress, dependencies });
                                }}>儲存</Button>
                            </>
                        ) : (
                            <Button colorScheme="teal" onClick={handleCreate}>新增</Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default GanttChart;
