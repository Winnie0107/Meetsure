import React from "react";
import MeetSureLogo from "assets/img/MeetSureLogo.jpg";
import { Avatar } from "@chakra-ui/react";

const FriendAvatar = ({ name, img }) => {
  // ✅ 只有 "Meetsure機器人" 才顯示 Logo，其他沒 img 就顯示字母頭像
  const avatarSrc = name === "Meetsure機器人"
    ? MeetSureLogo
    : img?.startsWith("http") || img?.startsWith("data:image")
    ? img
    : img
    ? `http://localhost:8000/media/${img}`
    : undefined;

  return <Avatar name={name} src={avatarSrc} size="sm" />;
};

export default FriendAvatar;
