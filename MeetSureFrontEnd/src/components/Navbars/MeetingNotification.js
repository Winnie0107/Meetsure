import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Text,
  Box,
  Badge
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import MeetSureLogo from "assets/img/MeetSureLogo.png";

// ✅ 格式化時間顯示
const formatDate = (datetimeStr) => {
  const date = new Date(datetimeStr);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const fetchRecentMeetings = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://127.0.0.1:8000/api/meetings/get_user_related_meetings/`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });

  if (!res.ok) return [];
  return await res.json();
};

export default function MeetingNotification() {
  const [meetingReminders, setMeetingReminders] = useState([]);
  const [prevMeetings, setPrevMeetings] = useState([]);

  useEffect(() => {
    const pollMeetings = async () => {
      const current = await fetchRecentMeetings();

      const currentMap = Object.fromEntries(current.map(m => [m.id, m]));
      const prevMap = Object.fromEntries(prevMeetings.map(m => [m.id, m]));

      const merged = [];

      for (const meeting of current) {
        const prev = prevMap[meeting.id];
        if (!prev) {
          merged.push({ ...meeting, type: "新增" });
        } else if (JSON.stringify(meeting) !== JSON.stringify(prev)) {
          merged.push({ ...meeting, type: "修改" });
        } else {
          merged.push({ ...meeting, type: "即將開始" });
        }
      }

      for (const prev of prevMeetings) {
        if (!currentMap[prev.id]) {
          merged.push({ ...prev, type: "刪除" });
        }
      }

      setMeetingReminders(merged);
      setPrevMeetings(current);
    };

    pollMeetings();
    const interval = setInterval(pollMeetings, 60000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = (type) => {
    switch (type) {
      case "新增":
        return "green";
      case "修改":
        return "yellow";
      case "刪除":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <Menu>
      <MenuButton as={Box} position="relative" ml="12px">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <IconButton
            icon={<CalendarIcon w={7} h={7} color="white" />}
            variant="ghost"
            _hover={{ bg: "gray.600" }}
          />
        </motion.div>

        {meetingReminders.length > 0 && (
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
            boxShadow="md"
          >
            {meetingReminders.length > 9 ? "9+" : meetingReminders.length}
          </Box>
        )}
      </MenuButton>

      <MenuList
        minH="200px"
        maxH="350px"
        overflowY="auto"
        boxShadow="lg"
        borderRadius="md"
      >
        {meetingReminders.length === 0 ? (
          <MenuItem>
            <Text color="gray.500">目前沒有即將開始的會議</Text>
          </MenuItem>
        ) : (
          meetingReminders.map((meeting) => (
            <MenuItem
              key={`${meeting.id}-${meeting.type}`}
              py={3}
              px={4}
              borderBottom="1px solid #eee"
              bg="gray.50" // ✅ 預設灰色背景
              _hover={{
                bg:
                  meeting.type === "新增"
                    ? "green.100"
                    : meeting.type === "修改"
                    ? "yellow.100"
                    : meeting.type === "刪除"
                    ? "red.100"
                    : "gray.100"
              }}
            >
              <Flex align="center" width="100%" gap={3}>
                <Box boxSize="32px" flexShrink={0}>
                  <img
                    src={MeetSureLogo}
                    alt="MeetSure Logo"
                    style={{
                      borderRadius: "8px",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </Box>
                <Flex direction="column" flex="1">
                  <Flex align="center" gap={2}>
                    <Text fontWeight="bold" mb="2px">
                      {meeting.name}
                    </Text>
                    <Badge colorScheme={getBadgeColor(meeting.type)}>
                      {meeting.type}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(meeting.datetime)} 開始
                  </Text>
                </Flex>
              </Flex>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
}
