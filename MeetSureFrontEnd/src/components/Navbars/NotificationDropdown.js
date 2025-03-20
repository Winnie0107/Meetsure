import React, { useState } from "react";
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
import avatar1 from "assets/img/avatars/avatar2.png";
import avatar2 from "assets/img/avatars/avatar3.png";
import avatar3 from "assets/img/avatars/avatar4.png";

export default function NotificationDropdown() {
  const [notifications] = useState([
    { time: "10 min ago", info: "New Message", from: "Alicia", aSrc: avatar1 },
    { time: "2 days ago", info: "New Album", from: "Josh Henry", aSrc: avatar2 },
    { time: "3 days ago", info: "Payment received", from: "Kara", aSrc: avatar3 },
    { time: "5 days ago", info: "Subscription renewed", from: "System", aSrc: avatar1 },
    { time: "1 week ago", info: "New Comment", from: "User123", aSrc: avatar2 },
  ]); // ✅ 測試 5 則通知，確保滾動條生效

  // 🔥 未讀通知數
  const unreadCount = notifications.length;
  const hasNewNotifications = unreadCount > 0;

  return (
    <Menu>
      <MenuButton as={Box} position="relative">
        {/* 🔔 Bell Icon - 增加動畫 */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }} // 左右搖擺
          transition={{ duration: 0.5, repeat: 2 }} // 0.5秒內搖晃兩次
        >
          <IconButton
            icon={<BellIcon w={8} h={8} color="white" />} // 🔹 稍微變大，讓整體更平衡
            variant="ghost"
            _hover={{ bg: "gray.600" }}
          />
        </motion.div>

        {/* 🔴 優化後的圓形數字徽章 */}
        {hasNewNotifications && (
          <Box
            position="absolute"
            top="-3px" // 🔹 往下移一點，讓徽章更貼近 BellIcon
            right="-2px" // 🔹 讓徽章更靠近 BellIcon
            bg="red.500"
            color="white"
            fontSize="12px" // 🔹 字體稍微變大，讓數字更清楚
            fontWeight="bold"
            w="20px" // 🔹 調整寬度，確保數字不擠
            h="20px" // 🔹 調整高度，讓圓形更均衡
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="full" // 🔹 讓它變成正圓形
            border="1.5px solid white" // 🔹 縮小白色邊框，讓它不突兀
            textAlign="center"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)" // 🔹 增加微陰影，讓徽章更自然
          >
            {unreadCount > 9 ? "9+" : unreadCount} {/* 如果超過9則顯示"9+" */}
          </Box>
        )}
      </MenuButton>

      {/* 🔽 通知列表 - 限制最大高度，允許滾動 */}
      <MenuList maxH="200px" overflowY="auto">
        {notifications.map((notif, index) => (
          <MenuItem key={index}>
            <Flex align="center">
              <Avatar name={notif.from} src={notif.aSrc} size="sm" mr={3} />
              <Flex direction="column">
                <Text fontWeight="bold">{notif.info}</Text>
                <Text fontSize="xs" color="gray.500">{notif.time}</Text>
              </Flex>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
