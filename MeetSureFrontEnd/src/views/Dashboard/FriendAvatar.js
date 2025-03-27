import React from "react";
import { Avatar } from "@chakra-ui/react";
import MeetSureLogo from "assets/img/MeetSureLogo.jpg";

const FriendAvatar = ({ name, img }) => {
  if (name === "Meetsure機器人") {
    return <Avatar name={name} src={MeetSureLogo} bg="transparent" />;
  }

  console.log("🧩 [FriendAvatar] img for", name, ":", img);

  const formattedImg =
    img?.startsWith("data:image")
      ? img
      : img
      ? `http://localhost:8000/media/${img.replace(/\\/g, "/")}`
      : undefined;

  return <Avatar name={name} src={formattedImg} />;
};

export default FriendAvatar;
