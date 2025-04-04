
export default function getAvatarUrl(userImg) {
    if (!userImg) {
      return "/default-profile.png"; // fallback 預設圖
    }
  
    // Firebase or base64 image
    if (userImg.startsWith("http") || userImg.startsWith("data:image")) {
      return userImg;
    }
  
    // 本地 media 圖片
    return `http://localhost:8000/media/${userImg}`;
  }
  