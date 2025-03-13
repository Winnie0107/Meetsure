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

  const LINE_ADD_FRIEND_URL = "https://line.me/R/ti/p/@459tzcgp"; // ✅ 替換成你的 LINE Bot ID

  const getNgrokUrl = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/get-ngrok-url/?t=${new Date().getTime()}`); // 加入時間戳，避免快取
        const data = await response.json();
        return data.ngrok_url;  
    } catch (error) {
        console.error("無法取得最新的 NGROK_URL:", error);
        return null;
    }
};

   // 🔥 綁定 LINE 帳號函數
   const bindLineAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("請先登入！");
        window.location.href = "/#/auth/signin";
        return;
    }
// 🔥 先詢問用戶是否已加入 LINE 好友
const isFriend = confirm("請確認你已加入 LINE 好友，否則請先加入！");
if (!isFriend) {
    window.location.href = LINE_ADD_FRIEND_URL; // 讓用戶跳轉到 LINE 好友邀請頁面
    return;
}
    try {
        const NGROK_URL = await getNgrokUrl(); // ✅ 先取得最新的 ngrok URL
        if (!NGROK_URL) {
            alert("無法取得最新的 ngrok 連結，請稍後再試！");
            return;
        }

        const apiUrl = `${NGROK_URL}/api/generate-verification-code/`; // ✅ 使用正確的變數插值
        console.log("發送 API 到:", apiUrl);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            alert(`請在 LINE 中輸入驗證碼: ${data.verification_code}`);
        } else {
            alert(`綁定 LINE 失敗: ${data.error || "請稍後再試"}`);
        }
    } catch (error) {
        console.error("綁定 LINE 失敗", error);
        alert("綁定 LINE 失敗，請稍後再試。");
    }
};

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
          <MenuItem onClick={bindLineAccount}>綁定 LINE 帳號</MenuItem>  {/* ✅ 新增綁定 LINE 選項 */}
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
