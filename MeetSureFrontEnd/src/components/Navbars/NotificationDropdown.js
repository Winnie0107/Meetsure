import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Flex,
  Text,
  Box
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";

export default function NotificationDropdown({ userEmail }) {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    if (!userEmail) {
      console.log("⚠️ 沒有 userEmail，停止請求 API");
      return;
    }

    console.log("📌 開始請求 API，使用 userEmail:", userEmail);

    fetch(`http://127.0.0.1:8000/api/friend_requests/list/?user_email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🔥 API 回傳的完整資料:", data);
        if (data.received_requests) {
          const pendingRequests = data.received_requests.filter(req => req.status === "pending");
          console.log("✅ 過濾後的 pendingRequests:", pendingRequests);
          setFriendRequests(pendingRequests);
        }
      })
      .catch((err) => console.error("獲取好友邀請失敗", err));
  }, [userEmail]);
  const history = useHistory();
  const handleNotificationClick = () => {
    window.location.href = "/#/admin/community#friends";
  };
  
  
  return (
    <Menu>
      <MenuButton as={Box} position="relative">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <IconButton icon={<BellIcon w={8} h={8} color="white" />} variant="ghost" _hover={{ bg: "gray.600" }} />
        </motion.div>

        {friendRequests.length > 0 && (
          <Box position="absolute" top="-3px" right="-2px" bg="red.500" color="white" fontSize="12px" fontWeight="bold"
            w="20px" h="20px" display="flex" alignItems="center" justifyContent="center" borderRadius="full">
            {friendRequests.length > 9 ? "9+" : friendRequests.length}
          </Box>
        )}
      </MenuButton>

      <MenuList maxH="250px" overflowY="auto">
        {friendRequests.length === 0 ? (
          <MenuItem><Text color="gray.500">目前沒有新的好友邀請</Text></MenuItem>
        ) : (
          friendRequests.map((req) => (
            <MenuItem key={req.id} onClick={handleNotificationClick}>
              <Flex align="center" width="100%">
                <Avatar
                  size="sm"
                  mr={3}
                  src={req["sender_img"] && req["sender_img"].trim() !== "" ? req["sender_img"] : "/default-avatar.png"}
                  name={undefined}
                />
                <Flex direction="column" flex="1">
                  <Text fontWeight="bold" whiteSpace="nowrap">{req["sender__name"] || "未知用戶"}</Text>
                  <Text fontSize="xs" color="gray.500">{req.sender_email} 想加你為好友</Text>
                </Flex>
              </Flex>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
}
