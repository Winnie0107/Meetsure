import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue, Avatar } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { ProfileIcon, SettingsIcon } from "components/Icons/Icons";
import axios from "axios";

export default function HeaderLinks(props) {
  const { colorMode } = useColorMode();
  
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.700", "gray.200");
  const menuBg = useColorModeValue("white", "navy.800");

  // 🔥 新增 state 來存儲用戶帳號
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userImg, setUserImg] = useState(null);

  useEffect(() => {
    // 檢查 localStorage 是否有存儲的 email
    const email = localStorage.getItem("user_email");
    if (email) {
      setUserEmail(email);
    }
    
    const userId = localStorage.getItem("user_id");
    if (userId) {
      axios.get(`http://localhost:8000/api/profile?user_id=${userId}`)
        .then((res) => {
          setUserName(res.data.name || "使用者");
          setUserImg(res.data.img || "black.png");
        })
        .catch((err) => {
          console.error("獲取用戶資料失敗:", err);
        });
    }
  }, []);

  // 🔥 登出函數
  const handleLogout = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    window.location.href = "/#/auth/homepage"; // 跳轉回登入頁面
  };

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
    >
      {userName ? (
        // ✅ 如果已登入，顯示 "用戶名稱 + 您好！" 和頭像
        <Menu>
          <MenuButton as={Button} variant="ghost" color="white" bg="transparent" _hover={{ bg: "gray.600" }}>
            <Flex align="center">
              {userImg === "black.png" ? (
                <ProfileIcon w="22px" h="22px" me="10px" />
              ) : (
                <Avatar src={`http://localhost:8000/media/${userImg}`} w="40px" h="40px" me="10px" />
              )}
              <Text color="white">{userName}，您好！</Text>
            </Flex>
          </MenuButton>
          <MenuList p="16px 8px" bg={menuBg}>
            <MenuItem onClick={handleLogout}>登出</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        // ✅ 未登入時，顯示 Sign In 按鈕
        <NavLink to="/auth/signin">
          <Button
            ms="0px"
            px="0px"
            me={{ sm: "2px", md: "16px" }}
            color={navbarIcon}
            variant="no-effects"
            rightIcon={<ProfileIcon color={navbarIcon} w="22px" h="22px" me="0px" />}
          >
            <Text display={{ sm: "none", md: "flex" }}>Sign In</Text>
          </Button>
        </NavLink>
      )}
    </Flex>
  );
}