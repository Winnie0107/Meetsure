import React, { useState } from "react";
import {
    Flex, Box, Icon, VStack, HStack, Text, Divider, Button, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Input, useDisclosure, FormControl, FormLabel, Checkbox
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { MdAdd } from "react-icons/md";

// 定義不同執行人員的顏色
const taskColors = {
    "pc": "#EEFFF7",  // 淺綠
    "px": "#FFEEFF",  // 淺紅
    "zhi": "#EFF7FF",  // 淺藍
    "c": "#FFF9C4 ",  // 淺黃
    "winnie": "#FFF4EE",  // 淺橘
};

const ToDoList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tasks, setTasks] = useState([
        { id: 1, name: "LINE API連接", assignedTo: "px", completed: false },
        { id: 2, name: "專案管理前後端", assignedTo: "pc", completed: false },
        { id: 3, name: "LLM 模型訓練", assignedTo: "zhi", completed: false },
        { id: 4, name: "撰寫發表文件", assignedTo: "c", completed: false },
        { id: 5, name: "社群功能後端", assignedTo: "winnie", completed: false },
    ]);

    const [newTaskName, setNewTaskName] = useState("");
    const [newAssignedTo, setNewAssignedTo] = useState("");

    // 新增任務
    const addTask = () => {
        if (!newTaskName || !newAssignedTo) return;
        setTasks([...tasks, { id: tasks.length + 1, name: newTaskName, assignedTo: newAssignedTo, completed: false }]);
        setNewTaskName("");
        setNewAssignedTo("");
        onClose();
    };

    // 切換任務狀態
    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    return (
        <Card flex="1" p="6" bg="white" boxShadow="lg" height="535px">
            <CardHeader pb="4">
                <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">待辦事項</Text>
                    <Icon as={MdAdd} boxSize={8} color="gray.500" cursor="pointer" onClick={onOpen} />
                </Flex>
                <Divider my="2" />
            </CardHeader>

            <VStack spacing={4} align="stretch">
                {/* 📌 Modal - 新增任務 */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>新增代辦事項</ModalHeader>
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
                                <Input
                                    placeholder="輸入執行人員..."
                                    value={newAssignedTo}
                                    onChange={(e) => setNewAssignedTo(e.target.value)}
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="gray" mr={3} onClick={onClose}>
                                取消
                            </Button>
                            <Button colorScheme="teal" onClick={addTask}>
                                確認新增
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* 📌 任務列表 */}
                {tasks.map((task) => (
                    <Box
                        key={task.id}
                        p="6"
                        bg={taskColors[task.assignedTo] || "white"} // 設定顏色
                        borderRadius="lg"
                        boxShadow="md"
                    >
                        <HStack justify="space-between">
                            <HStack>
                                <Checkbox
                                    isChecked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                    colorScheme="teal"
                                    borderColor="grey"
                                    mr="10px"
                                />
                                <Text fontSize="md" fontWeight="bold" textDecoration={task.completed ? "line-through" : "none"}>
                                    {task.name}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">{task.assignedTo}</Text>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </Card>
    );
};

export default ToDoList;
