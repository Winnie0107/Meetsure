import React, { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { FaTasks } from "react-icons/fa";
import ToDoBoardModal from "./ToDoBoardModal";

export default function ToDoNotifications() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestCount, setLatestCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchRecentTodos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/todos/recent/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await res.json();
        setLatestCount(data.length);
      } catch (error) {
        console.error("❌ 無法取得最新任務數量", error);
      }
    };

    fetchRecentTodos();
    const interval = setInterval(fetchRecentTodos, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box position="relative" display="flex" alignItems="center" justifyContent="center" w="36px" h="36px">
        <Tooltip label="待辦事項" hasArrow placement="bottom">
          <IconButton
            icon={<FaTasks color="white" style={{ fontSize: "26px" }} />}
            variant="ghost"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            size="sm"
            p="0"
            minW="auto"
            onClick={onOpen}
            aria-label="待辦事項"
          />
        </Tooltip>
        {latestCount > 0 && (
          <Box
            position="absolute"
            top="-3px"
            right="-2px"
            bg="red.500"
            color="white"
            fontSize="12px"
            fontWeight="bold"
            w="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
          >
            {latestCount > 9 ? "9+" : latestCount}
          </Box>
        )}
      </Box>

      <ToDoBoardModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
