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
  Box,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";

export default function NotificationDropdown({ userEmail }) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [groupNotifications, setGroupNotifications] = useState([]);
  const history = useHistory();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userEmail || !token) {
      console.log("⚠️ 缺少 userEmail 或 token，停止請求 API");
      return;
    }

    console.log("📌 開始請求通知資料，使用 userEmail:", userEmail);

    // 取得好友邀請
    fetch(`${process.env.REACT_APP_API_URL}/friend_requests/list/?user_email=${userEmail}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.received_requests) {
          const pendingRequests = data.received_requests.filter((req) => req.status === "pending");
          setFriendRequests(pendingRequests);
        }
      })
      .catch((err) => console.error("獲取好友邀請失敗", err));

    // 取得群組加入通知
    fetch(`${process.env.REACT_APP_API_URL}/group_join_notifications/?user_email=${userEmail}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGroupNotifications(data);
        } else {
          console.warn("⚠️ 回傳資料不是陣列，強制轉為空陣列");
          setGroupNotifications([]);
        }
      })
      .catch((err) => {
        console.error("獲取群組通知失敗", err);
        setGroupNotifications([]);
      });
  }, [userEmail, token]);

  const handleNotificationClick = () => {
    window.location.href = "/#/admin/community#friends";
  };

  return (
    <Menu>
      <MenuButton
        as={Box}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="36px"
        h="36px"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <IconButton
            icon={<BellIcon w={8} h={8} color="white" />}
            variant="ghost"
            _hover={{ bg: "gray.600" }}
            size="sm"
            p="0"
            minW="auto"
          />
        </motion.div>

        {(friendRequests.length + groupNotifications.length) > 0 && (
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
            {(friendRequests.length + groupNotifications.length) > 9
              ? "9+"
              : friendRequests.length + groupNotifications.length}
          </Box>
        )}
      </MenuButton>

      <MenuList maxH="250px" overflowY="auto">
        {friendRequests.length === 0 && groupNotifications.length === 0 ? (
          <MenuItem>
            <Text color="gray.500">目前沒有新的通知</Text>
          </MenuItem>
        ) : (
          <>
            {/* 好友邀請通知 */}
            {friendRequests.map((req) => (
              <MenuItem key={`friend-${req.id}`} onClick={handleNotificationClick}>
                <Flex align="center" width="100%">
                  <Avatar
                    size="sm"
                    mr={3}
                    src={
                      req["sender_img"] && req["sender_img"].trim() !== ""
                        ? req["sender_img"]
                        : "/default-avatar.png"
                    }
                    name={undefined}
                  />
                  <Flex direction="column" flex="1">
                    <Text fontWeight="bold" whiteSpace="nowrap">
                      {req["sender__name"] || "未知用戶"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      想加你為好友
                    </Text>
                  </Flex>
                </Flex>
              </MenuItem>
            ))}

            {/* 群組加入通知（自創群組 / 專案小組） */}
            {groupNotifications.map((notif) => (
 <MenuItem
 key={`group-${notif.id}`}
 onClick={() => (window.location.href = "/#/admin/community#groups")}
 px={4}
 py={3}
 bg="white"
 borderRadius="md"
 boxShadow="sm"
 _hover={{ boxShadow: "md", bg: "gray.50" }}
>

    <Flex align="center" width="100%">
      <Avatar
        size="sm"
        mr={4}
        src={"/default-avatar.png"}
        name={notif.owner_name}
        bg="green.400"
        color="white"
      />
      <Flex direction="column" flex="1">
        {/* ✅ 名稱 + 標籤放同一行 */}
        <Flex align="center" gap="2">
          <Text fontWeight="bold">{notif.owner_name}</Text>
          <Box
  as="span"
  bg={notif.group_type === "自創群組" ? "red.100" : "blue.100"}
  color={notif.group_type === "自創群組" ? "red.600" : "blue.600"}
  px={2}
  py={0.5}
  fontSize="11px"
  fontWeight="semibold"
  borderRadius="md"      // ✅ 改成 md，有圓角但是長方形
  lineHeight="1.2"
>
  {notif.group_type}
</Box>

        </Flex>

        {/* ✅ 加入群組訊息，群組名稱加粗 */}
        <Text fontSize="sm" color="gray.600" mt={1}>
  將你加進 <Text as="span" fontWeight="medium" color="gray.800">{notif.group_name}</Text>
</Text>

      </Flex>
    </Flex>
  </MenuItem>
))}


          </>
        )}
      </MenuList>
    </Menu>
  );
}
