import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Flex,
  Badge,
  Spinner,
  HStack,
  Checkbox,
  Tag
} from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";
import { MdNewReleases, MdLoop, MdDoneAll } from "react-icons/md";

const getPriority = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diff = now - created;
  const oneDay = 24 * 60 * 60 * 1000;
  if (diff < oneDay) return "High";
  if (diff < 3 * oneDay) return "Medium";
  return "Low";
};

const PriorityBadge = ({ priority }) => {
  const colorScheme = {
    High: "red",
    Medium: "yellow",
    Low: "green",
  }[priority];
  return <Badge colorScheme={colorScheme}>{priority}</Badge>;
};

const TaskCard = ({ task, onToggle }) => {
  const priority = getPriority(task.created_at);
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      mb={3}
      border="1px solid"
      borderColor="gray.100"
      _hover={{ bg: "gray.100", transform: "translateY(-2px)", boxShadow: "md", transition: "0.2s" }}
    >
      <Flex align="center" gap={3} mb={2}>
        <Checkbox
          isChecked={task.completed}
          colorScheme="teal"
          onChange={() => onToggle(task.id)}
        />
        <Flex align="center" gap={2}>
          <Text fontWeight="semibold">{task.name}</Text>
          <Tag size="sm" colorScheme="gray">{task.project_name}</Tag>
        </Flex>
      </Flex>
      <Text fontSize="sm" color="gray.600" mb={1}>
        {new Date(task.created_at).toLocaleDateString()}
      </Text>
      <PriorityBadge priority={priority} />
    </Box>
  );
};

const TaskColumn = ({ title, icon, tasks, bg, onToggle }) => (
  <Box
    flex="1"
    px={4}
    py={3}
    borderRadius="xl"
    minH="300px"
    bg={`${bg}`}
    style={{ backgroundColor: `${bg}40` }}
  >
    <Flex align="center" mb={4} gap={2} color="gray.700" fontWeight="bold">
      {icon}
      <Text fontSize="lg">{title}</Text>
      <Text fontSize="sm" color="gray.500">({tasks.length})</Text>
    </Flex>
    {tasks.length === 0 ? (
      <Text fontSize="sm" color="gray.400">無任務</Text>
    ) : (
      tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} />
      ))
    )}
  </Box>
);

export default function ToDoBoardModal({ isOpen, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/todos/all/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, [isOpen]);

  const toggleCompletion = (id) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const latest = tasks.filter(task => new Date(task.created_at) > new Date(now - oneDay));
  const inProgress = tasks.filter(task => !task.completed && new Date(task.created_at) <= new Date(now - oneDay));
  const completed = tasks.filter(task => task.completed);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalHeader>
          <Flex align="center" gap={2}>
            <FaClipboardList /> 我的待辦事項看板
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="lg" />
            </Flex>
          ) : (
            <>
              <Flex direction={{ base: "column", md: "row" }} gap={6} mb={4}>
                <TaskColumn
                  title="最新新增"
                  icon={<MdNewReleases size={18} />}
                  tasks={latest}
                  bg="#ebf8ff"
                  onToggle={toggleCompletion}
                />
                <TaskColumn
                  title="進行中"
                  icon={<MdLoop size={18} />}
                  tasks={inProgress}
                  bg="#fefcbf"
                  onToggle={toggleCompletion}
                />
                <TaskColumn
                  title="已完成"
                  icon={<MdDoneAll size={18} />}
                  tasks={completed}
                  bg="#c6f6d5"
                  onToggle={toggleCompletion}
                />
              </Flex>
              <HStack spacing={2} mt={2} alignItems="center">
                <Text fontSize="sm" color="gray.600">系統推薦優先順序：</Text>
                <Badge colorScheme="red">High</Badge>
                <Badge colorScheme="yellow">Medium</Badge>
                <Badge colorScheme="green">Low</Badge>
              </HStack>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
