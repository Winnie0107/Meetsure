import React, { useEffect, useState, useRef } from "react";
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
  Tag,
  useToast,
} from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";
import { MdNewReleases, MdLoop, MdDoneAll } from "react-icons/md";
import axios from "axios";

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
      <Box maxH="360px" overflowY="auto" pr={2}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={onToggle} />
        ))}
      </Box>
    )}
  </Box>
);

export default function ToDoBoardModal({ isOpen, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const deleteTimeouts = useRef({});

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");
    fetch(`${process.env.REACT_APP_API_URL}/todos/all/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, [isOpen]);

  const toggleCompletion = (id) => {
    const isNowChecked = !tasks.find((t) => t.id === id)?.completed;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

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
            <Text fontWeight="bold">即將刪除代辦事項</Text>
            <Text fontSize="md">將在 3 秒後刪除，可取消勾選以保留</Text>
          </Box>
        ),
      });

      // 進行 3 秒後刪除
      deleteTimeouts.current[id] = setTimeout(() => deleteTask(id), 3000);
    } else {
      // 當勾選被取消時清除刪除的計時器
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
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("❌ 刪除失敗", err);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(deleteTimeouts.current).forEach(clearTimeout);
    };
  }, []);

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
                
              </Flex>
              <HStack spacing={4} mt={4} alignItems="center">
  <Text fontSize="md" color="gray.600">系統推薦優先順序：</Text>
  <Badge colorScheme="red" fontSize="lg">High</Badge>
  <Badge colorScheme="yellow" fontSize="lg">Medium</Badge>
  <Badge colorScheme="green" fontSize="lg">Low</Badge>
</HStack>

            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
