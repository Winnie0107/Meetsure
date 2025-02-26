import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { ProfileIcon, SettingsIcon } from "components/Icons/Icons";

export default function HeaderLinks(props) {
  const { colorMode } = useColorMode();
  
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.700", "gray.200");
  const menuBg = useColorModeValue("white", "navy.800");

  // 🔥 新增 state 來存儲用戶帳號
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // 檢查 localStorage 是否有存儲的 email
    const email = localStorage.getItem("user_email");
    if (email) {
      setUserEmail(email);
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
      
      {userEmail ? (
        // ✅ 如果已登入，顯示 "用戶帳號 + 您好！"
        <Menu>
          <MenuButton as={Button} variant="ghost" color="white"  bg="transparent" _hover={{ bg: "gray.600" }}>
            <Flex align="center">
              <ProfileIcon w="22px" h="22px" me="10px" />
              <Text color="white">{userEmail}，您好！</Text>
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
