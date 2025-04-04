import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue, Avatar
} from "@chakra-ui/react";
import { BellIcon,CheckIcon} from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { ProfileIcon, SettingsIcon } from "components/Icons/Icons";
import NotificationDropdown from "components/Navbars/NotificationDropdown";
import MeetingNotification from "components/Navbars/MeetingNotification";
import axios from "axios";
import getAvatarUrl from "components/Icons/getAvatarUrl";


export default function HeaderLinks(props) {
  const { colorMode } = useColorMode();
  const navbarIcon = useColorModeValue("gray.700", "gray.200");
  const menuBg = useColorModeValue("white", "navy.800");

  const [userEmail, setUserEmail] = useState(null);
  const [isLineBound, setIsLineBound] = useState(false);

  const LINE_ADD_FRIEND_URL = "https://line.me/R/ti/p/@459tzcgp"; // ✅ 替換成你的 LINE Bot ID
  const [userName, setUserName] = useState(null);
  const [userImg, setUserImg] = useState(null);

  // ✅ 檢查是否登入 + 檢查是否已綁定 LINE
  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email) {
      setUserEmail(email);
    }

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/api/check-line-binding/", {
        headers: {
          Authorization: `Token ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setIsLineBound(data.is_linked); // ✅ 儲存綁定狀態
        })
        .catch(err => console.error("檢查 LINE 綁定失敗:", err));
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

  // ✅ 取得 ngrok URL
  const getNgrokUrl = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-ngrok-url/?t=${new Date().getTime()}`);
      const data = await response.json();
      return data.ngrok_url;
    } catch (error) {
      console.error("無法取得 ngrok URL:", error);
      return null;
    }
  };

  // ✅ 綁定 LINE 帳號流程
  const bindLineAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("請先登入！");
      window.location.href = "/#/auth/signin";
      return;
    }

    const isFriend = confirm("請確認你已加入 LINE 好友，否則請先加入！");
    if (!isFriend) {
      window.location.href = LINE_ADD_FRIEND_URL;
      return;
    }

    try {
      const NGROK_URL = await getNgrokUrl();
      if (!NGROK_URL) {
        alert("無法取得 ngrok 連結，請稍後再試！");
        return;
      }

      const response = await fetch(`${NGROK_URL}/api/generate-verification-code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (response.ok) {
        alert(`請在 LINE 中輸入驗證碼: ${data.verification_code}`);
      } else {
        alert(`綁定失敗: ${data.error || "請稍後再試"}`);
      }
    } catch (error) {
      console.error("綁定 LINE 失敗", error);
      alert("綁定失敗，請稍後再試");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    window.location.href = "/#/auth/homepage";
  };

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
    >
      <Flex alignItems="center" gap="10px">
        <MeetingNotification userEmail={userEmail} />
        <NotificationDropdown userEmail={userEmail} />
      </Flex>

      {userEmail ? (
        <Menu>
          <MenuButton as={Button} variant="ghost" color="white" bg="transparent" _hover={{ bg: "gray.600" }}>
            <Flex align="center">
              {userImg === "black.png" ? (
                <ProfileIcon w="22px" h="22px" me="10px" />
              ) : (
                <Avatar src={getAvatarUrl(userImg)} w="40px" h="40px" me="10px" />
              )}
              <Text color="white">{userName}，您好！</Text>
            </Flex>
          </MenuButton>
          <MenuList p="16px 8px" bg={menuBg}>
            {isLineBound ? (
              <MenuItem isDisabled>
  <Flex align="center" gap="2px" color="green.500">
  
  <CheckIcon boxSize={4} />
    <Text fontWeight="bold">已綁定 LINE 帳號</Text>
  </Flex>
</MenuItem>            ) : (
              <MenuItem onClick={bindLineAccount}>綁定 LINE 帳號</MenuItem>
            )}
            <MenuItem onClick={handleLogout}>登出</MenuItem>
          </MenuList>
        </Menu>
      ) : (
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