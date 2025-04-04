import React, { useEffect, useState } from "react";
import {
  Flex, Box, Icon, VStack, HStack, Text, Divider, Button, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Input, useDisclosure, FormControl, FormLabel, Checkbox, Select
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { MdAdd } from "react-icons/md";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";

const ToDoList = () => {
  const { id: projectId } = useParams(); // ✅ 從 URL 中取得 projectId
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("");
  const [taskColors, setTaskColors] = useState({});

  // 隨機顏色生成器
  const getRandomColor = () => {
    const pastelColors = ["#EEFFF7", "#FFEEFF", "#EFF7FF", "#FFF9C4", "#FFF4EE"];
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  // 🎯 載入任務清單
  useEffect(() => {
    if (!projectId) return;

    const token = localStorage.getItem("token");
    axios
      .get(`http://127.0.0.1:8000/api/todos/?project_id=${projectId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
        const newColors = {};
        res.data.forEach((task) => {
          if (!newColors[task.assigned_to_name]) {
            newColors[task.assigned_to_name] = getRandomColor();
          }
        });
        setTaskColors(newColors);
      });
  }, [projectId]);

  // 🎯 載入專案成員清單
  useEffect(() => {
    if (!projectId) return;

    const token = localStorage.getItem("token");

    const fetchMembers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/project-members/?project_id=${projectId}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setMembers(response.data);
      } catch (error) {
        console.error("❌ 專案成員抓取失敗:", error);
      }
    };

    fetchMembers();
  }, [projectId]);

  // ✅ 新增任務
  const addTask = () => {
    if (!newTaskName || !newAssignedTo) return;

    const token = localStorage.getItem("token");

    axios
      .post(
        "http://127.0.0.1:8000/api/todos/",
        {
          name: newTaskName,
          assigned_to: newAssignedTo,
          project: projectId,
          completed: false,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        const task = res.data;
        const assignedUser = members.find((m) => String(m.ID) === String(task.assigned_to));
        task.assigned_to_name = assignedUser?.name || "未知";

        setTasks([...tasks, task]);
        setTaskColors((prev) => ({
          ...prev,
          [task.assigned_to_name]: prev[task.assigned_to_name] || getRandomColor(),
        }));
        setNewTaskName("");
        setNewAssignedTo("");
        onClose();
      });
  };

  // ✅ 切換完成狀態
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
                <Select
                  placeholder="選擇一位成員"
                  value={String(newAssignedTo)}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                >
                  {members.map((member) => (
                    <option key={member.ID} value={String(member.ID)}>
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

        {/* 📌 任務列表 */}
        {tasks.map((task) => (
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
                  borderColor="grey"
                  mr="10px"
                />
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  textDecoration={task.completed ? "line-through" : "none"}
                >
                  {task.name}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.600">{task.assigned_to_name}</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Card>
  );
};

export default ToDoList;
