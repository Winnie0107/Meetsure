import React, { useEffect, useState, useRef } from "react";
import {
    Flex, Box, Icon, VStack, HStack, Text, Divider, Button, Modal, ModalOverlay, ModalContent, useToast,
    ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Input, useDisclosure, FormControl, FormLabel, Checkbox, Select
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { MdAdd, MdSend } from "react-icons/md";
import axios from "../../api/axios";

// 預設顏色對應表（可依需求調整）
const predefinedColors = [
    "#EEFFF7", "#FFEEFF", "#EFF7FF", "#FFF9C4", "#FFF4EE", "#E6F0FF", "#FBE8E7", "#E7F5E6"
];

const ToDoList = ({ projectId, setTabIndex, limit = false, tasks, setTasks }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [members, setMembers] = useState([]);
    const [newTaskName, setNewTaskName] = useState("");
    const [newAssignedTo, setNewAssignedTo] = useState("");
    const [taskColors, setTaskColors] = useState({});
    const deleteTimeouts = useRef({});
    const toast = useToast();

  // 🎯 載入任務清單
  useEffect(() => {
    if (!projectId) return;

        const token = localStorage.getItem("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/todos/?project_id=${projectId}`, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((res) => {
                setTasks(res.data);
            });
    }, [projectId]);

    // 🎯 載入專案成員並設定顏色對應
    useEffect(() => {
        if (!projectId) return;
        const token = localStorage.getItem("token");

        const fetchMembers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/project-members/?project_id=${projectId}`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setMembers(res.data);

                // 固定分配顏色
                const colorMap = {};
                res.data.forEach((member, index) => {
                    colorMap[member.name] = predefinedColors[index % predefinedColors.length];
                });
                setTaskColors(colorMap);
            } catch (err) {
                console.error("❌ 成員載入失敗：", err);
            }
        };

        fetchMembers();
    }, [projectId]);

    // ✅ 新增任務
    const addTask = () => {
        if (!newTaskName || !newAssignedTo) return;
        const token = localStorage.getItem("token");

        axios
            .post(`${process.env.REACT_APP_API_URL}/todos/`, {
                name: newTaskName,
                assigned_to: newAssignedTo,
                project: projectId,
                completed: false,
            }, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((res) => {
                const task = res.data;
                const assignedUser = members.find((m) => String(m.id) === String(task.assigned_to));
                task.assigned_to_name = assignedUser?.name || "未知";

                setTasks((prev) => [...prev, task]);
                setNewTaskName("");
                setNewAssignedTo("");
                onClose();
            
            })
            .catch((err) => {
                console.error("❌ 新增待辦失敗：", err.response?.data || err);
                alert(`新增失敗：${err.response?.data?.error || "請確認輸入內容"}`);
              });
    };

    // ✅ 勾選切換與 3 秒後刪除
    const toggleTaskCompletion = (id) => {
        setTasks(prev =>
            prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        );

        const isNowChecked = !tasks.find(t => t.id === id)?.completed;

        if (isNowChecked) {
            toast({
                position: "top",
                duration: 3000,
                isClosable: true,
                render: () => (
                    <Box
                        bg="teal.400"
                        color="white"
                        px={8}
                        py={6}
                        borderRadius="lg"
                        boxShadow="lg"
                    >
                        <Text fontWeight="bold">即將刪除待辦事項</Text>
                        <Text fontSize="md">將在 3 秒後刪除，可取消勾選以保留</Text>
                    </Box>
                ),
            });

            deleteTimeouts.current[id] = setTimeout(() => deleteTask(id), 3000);
        } else {
            clearTimeout(deleteTimeouts.current[id]);
            delete deleteTimeouts.current[id];
        }
    };

    const deleteTask = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/todos/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            console.error("❌ 刪除失敗", err);
        }
    };

    // 清除 timeout
    useEffect(() => {
        return () => {
            Object.values(deleteTimeouts.current).forEach(clearTimeout);
        };
    }, []);

    return (
        <Card flex="1" p="6" bg="white" boxShadow="lg" minHeight="535px">
            <CardHeader pb="4">
                <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">待辦事項</Text>
                    <Icon as={MdAdd} boxSize={8} color="gray.500" cursor="pointer" onClick={onOpen} />
                </Flex>
                <Divider my="2" />
                <Text fontSize="sm" color="gray.500">完成後 請勾選消除待辦事項</Text>
            </CardHeader>

            <VStack spacing={4} align="stretch">
                {/* Modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p={4} borderRadius="25px">
                        <ModalHeader>新增待辦事項</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl mb={3}>
                                <FormLabel>任務名稱</FormLabel>
                                <Input
                                    placeholder="輸入任務名稱..."
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl mb={3}>
                                <FormLabel>選擇執行人員</FormLabel>
                                <Select
                                    placeholder="選擇一位成員"
                                    value={String(newAssignedTo)}
                                    onChange={(e) => setNewAssignedTo(e.target.value)}
                                >
                                    {members.map((member) => (
                                        <option key={member.ID} value={String(member.id)}>
                                            {member.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="gray" mr={3} onClick={onClose}>取消</Button>
                            <Button colorScheme="teal" onClick={addTask}>確認新增</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* 代辦事項清單 */}
                {(limit ? tasks.slice(0, 4) : tasks).map((task) => (
                    <Box
                        key={task.id}
                        p="6"
                        bg={taskColors[task.assigned_to_name] || "white"}
                        borderRadius="lg"
                        boxShadow="md"
                    >
                        <HStack justify="space-between">
                            <HStack>
                                <Checkbox
                                    isChecked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                    colorScheme="teal"
                                    borderColor="gray"
                                    mr="10px"
                                />
                                <Text fontSize="md" fontWeight="bold" textDecoration={task.completed ? "line-through" : "none"}>
                                    {task.name}
                                </Text>
                            </HStack>
                            <Text fontSize="md" color="gray.600">{task.assigned_to_name}</Text>
                        </HStack>
                    </Box>
                ))}
            </VStack>

            {/* 查看更多按鈕 */}
            {tasks.length > 4 && setTabIndex && limit && (
                <Button
                    onClick={() => setTabIndex(2)}
                    variant="ghost"
                    colorScheme="blue"
                    alignSelf="center"
                    mt="30px"
                >
                    查看更多待辦事項
                    <Icon ml={2} as={MdSend} color="blue.500" boxSize={4} />
                </Button>
            )}
        </Card>
    );
};

export default ToDoList;
