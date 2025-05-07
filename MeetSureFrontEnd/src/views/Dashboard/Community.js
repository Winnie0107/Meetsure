
import {
    Flex,
    Box,
    Input,
    Button,
    Text,
    VStack,
    HStack,
    useColorModeValue,
    IconButton,
    Avatar,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Icon,
    Checkbox,

} from "@chakra-ui/react";
import { ChatIcon, StarIcon, DeleteIcon, ViewIcon, } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import MeetSureLogo from "assets/img/MeetSureLogo.jpg"; // 匯入你的圖片
import axios from "axios";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import FriendAvatar from "./FriendAvatar";
import { useLocation } from "react-router-dom";
import GroupSection from "./GroupSection";




import { FaPlusCircle, FaExclamationTriangle, FaTools, FaThumbtack } from "react-icons/fa";

function SocialPage() {
    const backgroundColor = useColorModeValue("white");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const sidebarBg = useColorModeValue("gray.100", "gray.800");

    const [selectedTab, setSelectedTab] = useState("chat");
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [chatMessages, setChatMessages] = useState({
        general: [],
        "Meetsure機器人": [
            {
                sender: "Meetsure機器人",
                content:
                    "您好！請選擇您想問的問題，如果還是無法解答您，可以透過下方對話框輸入問題，得到客製化回覆～",
            },
        ],
    });


    const [friendsList, setFriendsList] = useState([
        { name: "Meetsure機器人", status: "auto-reply" }, // 將MeetSure機器人加入

    ]);
    const [inputValue, setInputValue] = useState("");
    const [friendRequests, setFriendRequests] = useState([]);
    const [newFriendEmail, setNewFriendEmail] = useState("");
    const userEmail = localStorage.getItem("user_email");
    const [sentFriendRequests, setSentFriendRequests] = useState([]);
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupsList, setGroupsList] = useState([]);  // ✅ 存儲群組清單
    const [groupInvites, setGroupInvites] = useState([]);  // ✅ 存儲群組邀請
    const [newGroupName, setNewGroupName] = useState("");  // ✅ 用來存儲新群組名稱
    const [selectedFriends, setSelectedFriends] = useState([]);  // ✅ 確保 `selectedFriends` 有初始化
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
    const { isOpen: isAddFriendModalOpen, onOpen: onOpenAddFriendModal, onClose: onCloseAddFriendModal } = useDisclosure();
    const location = useLocation();
    useEffect(() => {
        if (window.location.hash === "#friends") {
            setSelectedTab("friends");
        } else {
            setSelectedTab("chat");
            setSelectedFriend("Meetsure機器人");  // ✅ 預設選擇 AI 機器人
        }
    }, []);
    // ✅ **獲取好友列表**
    const fetchFriends = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/friends/?user_email=${userEmail}`);
          console.log("🔥 來自 API 的好友列表:", response.data);
      
          if (response.data.friends) {
            const formattedFriends = [
              {
                name: "Meetsure機器人",
                email: "Meetsure機器人",
                status: "auto-reply",
                img: MeetSureLogo, // ✅ 指定 logo 圖片
              },
              ...response.data.friends.map(friend => ({
                name: friend.name,
                email: friend.email,
                status: "online",
                img: friend.img || null,
              }))
            ];
      
            console.log("🧾 friendsList 組裝後:", formattedFriends); // ✅ debug 用
            setFriendsList(formattedFriends);
          }
        } catch (error) {
          console.error("❌ 獲取好友列表失敗:", error);
        }
      };
      
    // ✅ **獲取待確認的好友邀請**
    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/friend_requests/list/?user_email=${userEmail}`);
            console.log("🔥 來自 API 的好友邀請:", response.data);

            const { sent_requests, received_requests } = response.data;

            // ✅ 確保只顯示 `pending` 狀態的請求
            setSentFriendRequests(
                (sent_requests || []).filter(req => req.status === "pending").map(req => ({
                    id: req.id,
                    receiver_email: req.receiver__email || "未知接收者",
                    receiver_name: req.receiver__name || req.receiver__email || "未知接收者",
                    status: req.status
                }))
            );

            setReceivedFriendRequests(
                (received_requests || []).filter(req => req.status === "pending").map(req => ({
                    id: req.id,
                    sender_email: req.sender__email || "未知發送者",
                    sender_name: req.sender__name || req.sender__email || "未知發送者",
                    status: req.status
                }))
            );

        } catch (error) {
            console.error("❌ 獲取好友邀請失敗", error);
        }
    };

    // ✅ **獲取用戶的群組清單**
    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem("token");  // ✅ 加上這行
            const response = await axios.get(`http://127.0.0.1:8000/api/groups/?user_email=${userEmail}`, {
                headers: { Authorization: `Token ${token}` }  // ✅ 加上 headers
            });
            console.log("🔥 來自 API 的群組列表:", response.data);
            setGroupsList(response.data || []);
        } catch (error) {
            console.error("❌ 獲取群組列表失敗:", error);
        }
    };


    // ✅ **獲取群組邀請**
    const fetchGroupInvites = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/group_invites/?user_email=${userEmail}`);
            console.log("🔥 來自 API 的群組邀請:", response.data);
            setGroupInvites(response.data.received_invites || []);
        } catch (error) {
            console.error("❌ 獲取群組邀請失敗:", error);
        }
    };

    // ✅ **發送訊息給MeetSure機器人**
    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        // 這是用戶原本輸入的訊息（UI 顯示）
        const userMessage = { sender: "You", content: inputValue };

        // 如果是傳送給 "Meetsure機器人"，則在訊息後面加上 "用中文回答"
        const botMessageText = selectedFriend === "Meetsure機器人"
            ? `${inputValue} 用中文回答`
            : inputValue;

        setChatMessages((prevMessages) => ({
            ...prevMessages,
            [selectedFriend || "general"]: [...prevMessages[selectedFriend || "general"], userMessage],
        }));

        if (selectedFriend === "Meetsure機器人") {
            try {
                const response = await fetch("http://localhost:3001/api/v1/workspace/zhi-workspace/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer 06JBKJC-TPJ46K5-KCRNVPS-M66G24D",
                        "accept": "application/json"
                    },
                    body: JSON.stringify({
                        message: botMessageText, // 這裡的 message 會帶 "用中文回答"
                        mode: "chat",
                        sessionId: "same-session-id",
                    }),
                });

                const data = await response.json();
                const botMessage = { sender: "Meetsure機器人", content: data.textResponse };

                setChatMessages((prevMessages) => ({
                    ...prevMessages,
                    "Meetsure機器人": [...prevMessages["Meetsure機器人"], botMessage],
                }));
            } catch (error) {
                console.error("Error fetching bot response:", error);
                setChatMessages((prevMessages) => ({
                    ...prevMessages,
                    "Meetsure機器人": [...prevMessages["Meetsure機器人"], { sender: "Meetsure機器人", content: "發送請求失敗，請稍後再試。" }],
                }));
            }
        }

        setInputValue("");
    };




    // ✅ **發送好友邀請**
    const handleSendFriendRequest = async () => {
        if (!newFriendEmail.trim()) {
            alert("請輸入好友 Email");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/friend_requests/", {
                sender_email: userEmail,
                receiver_email: newFriendEmail
            });

            alert("好友邀請已發送！");
            setNewFriendEmail("");

            // ✅ 立即更新 UI
            await fetchFriendRequests();
        } catch (error) {
            console.error("❌ 發送好友邀請失敗:", error.response?.data);
            alert(error.response?.data?.error || "發送好友邀請失敗");
        }
    };

    const [searchResults, setSearchResults] = useState([]);
    // ✅ **好友模糊搜索**
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchSearchResults = async () => {
                if (!newFriendEmail.trim()) {
                    setSearchResults([]);
                    return;
                }
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://127.0.0.1:8000/api/search_users/?keyword=${newFriendEmail}&exclude=${userEmail}`,
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        }
                    );
                    setSearchResults(response.data);
                } catch (error) {
                    console.error("❌ 搜尋使用者失敗:", error);
                }
            };
            fetchSearchResults();
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [newFriendEmail]);




    // ✅ **接受/拒絕好友邀請**
    const handleRespondToRequest = async (requestId, status) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/friend_requests/${requestId}/`, { status });

            // ✅ **手動更新 UI，立即移除已處理的請求**
            setReceivedFriendRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
            setSentFriendRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));

            // ✅ **確保更新好友列表**
            await fetchFriends();

            // ✅ **重新拉取好友邀請，確保已接受的邀請不會再顯示**
            await fetchFriendRequests();

        } catch (error) {
            console.error("❌ 處理好友請求失敗:", error);
        }
    };



    // ✅ **刪除好友**
    const handleDeleteFriend = async (friendEmail) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/friends/`, {
                data: { user_email: userEmail, friend_email: friendEmail }
            });

            // ✅ 立即更新 UI
            await fetchFriends();
        } catch (error) {
            console.error("❌ 刪除好友失敗:", error);
        }
    };

    const fetchMessages = () => {
        if (!selectedFriend || selectedFriend === "Meetsure機器人") return;

        const isGroup = groupsList.some(group => group.name === selectedFriend);
        const conversationId = isGroup ? selectedFriend : [userEmail, selectedFriend].sort().join("_");

        const q = query(
            collection(db, "meetsure"),
            where("conversation_id", "==", conversationId),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setChatMessages(prevMessages => ({
                ...prevMessages,
                [selectedFriend]: messages
            }));
        });

        return () => unsubscribe();
    };

    // ✅ 初始化聊天室視圖（從 localStorage 抓取 tab 與 friend）只執行一次
    useEffect(() => {
        const tab = localStorage.getItem("selected_tab") || "chat";
        const friend = localStorage.getItem("selected_friend");

        setSelectedTab(tab);
        if (friend) {
            setSelectedFriend(friend);
        }

        // ✅ 用完後清除，避免干擾未來邏輯
        localStorage.removeItem("selected_tab");
        localStorage.removeItem("selected_friend");
    }, []);

    // ✅ 每當 selectedFriend 改變，就抓取聊天記錄或顯示機器人訊息
    useEffect(() => {
        if (selectedFriend === "Meetsure機器人") {
            setChatMessages((prev) => ({
                ...prev,
                "Meetsure機器人": [
                    {
                        sender: "Meetsure機器人",
                        content:
                            "您好！請選擇您想問的問題，如果還是無法解答您，可以透過下方對話框輸入問題，得到客製化回覆～",
                    },
                ],
            }));
        } else if (selectedFriend) {
            fetchMessages();
        }
    }, [selectedFriend]);

    // ✅ 當 userEmail 改變時，刷新好友、群組與邀請清單
    useEffect(() => {
        fetchFriends();
        fetchFriendRequests();
        fetchGroups();
        fetchGroupInvites();
    }, [userEmail]);


    const handleSendMessage_F = async () => {
        if (!inputValue.trim() || !selectedFriend) return;

        const isGroup = groupsList.some(group => group.name === selectedFriend);
        const conversationType = isGroup ? "group" : "individual";
        const conversationId = isGroup ? selectedFriend : [userEmail, selectedFriend].sort().join("_");

        try {
            const response = await fetch("http://127.0.0.1:8000/send_message/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: userEmail,
                    receiver: isGroup ? undefined : selectedFriend,
                    message: inputValue,
                    conversation_id: conversationId,
                    conversation_type: conversationType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "發送訊息失敗");
            }

            setInputValue("");
        } catch (error) {
            console.error("❌ 發送訊息失敗:", error);
        }
    };



    const chatTargets = [
        ...friendsList,  // friendsList 已經有 { name: "Meetsure機器人", email: "Meetsure機器人", img: null }
        ...groupsList.map(group => ({
            name: group.name,
            email: group.name,
            status: "group",
            img: group.owner?.img || null
        }))
    ];


    const getUserNameByEmail = (email) => {
        const allUsers = [...friendsList, ...groupsList]; // or chatTargets
        const found = allUsers.find(u => u.email === email);
        return found?.name || email; // 找不到就顯示 email
    };


    //左側好友聊天室顯示
    const renderFriendsSidebar = () => {
        return (
            <Box
                w="250px"
                bg={sidebarBg}
                p="10px"
                borderRight="1px solid"
                borderColor={borderColor}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
            >


                <VStack spacing={4} align="stretch">
                    {chatTargets.map((friend) => (
                        <HStack
                            key={friend.name}
                            p={2}
                            bg="gray.100"
                            borderRadius="lg"
                            _hover={{ bg: "gray.200" }}
                            justify="space-between"
                            cursor="pointer"
                            onClick={() => setSelectedFriend(friend.email || friend.name)}
                        >
                            <HStack>
                                <FriendAvatar name={friend.name} img={friend.img} />



                                <Box>
                                    {/* 顯示名稱為黑色 */}
                                    <Text fontWeight="bold" color="black" noOfLines={1} whiteSpace="nowrap">
                                        {friend.name}
                                    </Text>
                                    {/* 根據名稱顯示不同狀態 */}
                                    {friend.status === "group" ? (
                                        <Badge colorScheme="purple" fontSize="xs">群組</Badge>
                                    ) : (
                                        <Badge
                                            colorScheme={
                                                friend.name === "Meetsure機器人"
                                                    ? "gray"
                                                    : friend.status === "online"
                                                        ? "green"
                                                        : "gray"
                                            }
                                        >
                                            {friend.name === "Meetsure機器人"
                                                ? "自動回覆"
                                                : friend.status === "online"
                                                    ? "在線"
                                                    : "離線"}
                                        </Badge>
                                    )}

                                </Box>
                            </HStack>
                            {friend.name === "Meetsure機器人" && (
                                <IconButton
                                    size="sm"
                                    icon={
                                        <FaThumbtack
                                            style={{
                                                transform: "rotate(45deg)",
                                                color: "#f44336", // 可改成你想要的紅
                                                fontSize: "20px", // 放大圖示
                                                filter: "drop-shadow(0 0 1px black)", // 加黑邊
                                            }}
                                        />
                                    }
                                    aria-label="Pin to top"
                                    bg="transparent"
                                    _hover={{ bg: "transparent" }}
                                    variant="ghost"
                                />

                            )}
                        </HStack>
                    ))}
                </VStack>
            </Box>
        );
    };


    //好友頁面
    const renderFriendsList = () => {
        return (
            <Box flex="1" p="20px" overflowY="auto">
                <VStack spacing={4} align="stretch">
                    {/* 🔹 搜尋好友輸入框 */}
                    <Box p="10px" bg="gray.100" borderRadius="lg">
                        <HStack>
                            <Input
                                placeholder="請輸入 Email 或 用戶名稱 查詢"
                                value={newFriendEmail}
                                onChange={(e) => setNewFriendEmail(e.target.value)}
                            />
                            <Button colorScheme="blue" onClick={handleSendFriendRequest}>
                                發送邀請
                            </Button>
                        </HStack>

                        {/* 🔽 搜尋結果移出 HStack，顯示在下方 */}
                        {searchResults.length > 0 && (
                            <Box bg="white" p="4" borderRadius="md" boxShadow="md" mt="2">
                                <Text fontWeight="bold" mb="2">搜尋結果：</Text>
                                {searchResults.map(user => (
                                    <HStack
                                        key={user.email}
                                        justify="space-between"
                                        mb="2"
                                        _hover={{ bg: "gray.100", cursor: "pointer" }}
                                        p="2"
                                        borderRadius="md"
                                        onClick={() => {
                                            setNewFriendEmail(user.email);  // 自動填入
                                            setSearchResults([]);           // 清空結果列表
                                        }}
                                    >
                                        <HStack>
                                            <FriendAvatar name={user.name} img={user.img} />
                                            <Box>
                                                <Text>{user.name}（{user.email}）</Text>
                                            </Box>
                                        </HStack>
                                    </HStack>
                                ))}
                            </Box>
                        )}

                    </Box>

                    {/* 📌 好友區塊 (左右並排) */}
                    <HStack spacing={6} align="start">
                        {/* 🔹 左側 - 好友列表 */}
                        <Box flex="1" bg="white" p="4" borderRadius="lg" boxShadow="md" h="75vh">
                            <Text fontSize="lg" fontWeight="bold" mb="4">我的好友 👥</Text>
                            {friendsList.length === 0 ? (
                                <Text color="gray.500">目前沒有好友</Text>
                            ) : (
                                friendsList.map((friend, index) => (
                                    <HStack
                                        key={friend.email || index}
                                        p="10px"
                                        bg="gray.100"
                                        borderRadius="lg"
                                        justify="space-between"
                                        alignItems="center"
                                    >
                                        <HStack>
                                            <FriendAvatar name={friend.name} img={friend.img} />



                                            <Box>
                                                <Text fontWeight="bold">{friend.name}</Text>
                                                <Badge colorScheme={friend.status === "online" ? "green" : "gray"}>
                                                    {friend.status === "online" ? "在線" : "離線"}
                                                </Badge>
                                            </Box>
                                        </HStack>
                                        <HStack>
                                            <IconButton
                                                size="md"
                                                bg="rgba(49, 130, 206, 0.67)"
                                                icon={<ChatIcon />}
                                                aria-label="聊天"
                                                onClick={() => {
                                                    setSelectedTab("chat");
                                                    setSelectedFriend(friend.email || friend.name);
                                                }}
                                            />
                                            <IconButton
                                                size="md"
                                                bg="rgba(206, 57, 49, 0.67)"
                                                icon={<DeleteIcon />}
                                                aria-label="刪除好友"
                                                onClick={() => {
                                                    setSelectedTab("chat");
                                                    setSelectedFriend(friend.email);  // ✅ 確保 Key 正確
                                                }}
                                            />
                                        </HStack>
                                    </HStack>
                                ))
                            )}
                        </Box>

                        {/* 🔹 右側 - 好友邀請 (已送出 / 收到) */}
                        <Box flex="1" bg="white" p="4" borderRadius="lg" boxShadow="md" minW="250px" h="75vh">
                            <Text fontSize="lg" fontWeight="bold" mb="4">好友邀請 📩</Text>

                            {/* 已送出邀請 */}
                            <Text fontSize="md" fontWeight="bold" mt="2">已送出邀請</Text>
                            {sentFriendRequests.length === 0 ? (
                                <Text color="gray.500">目前沒有送出的邀請</Text>
                            ) : (
                                sentFriendRequests.map((req) => (
                                    <HStack
                                        key={req.id}
                                        p="10px"
                                        bg="gray.100"
                                        borderRadius="lg"
                                        justify="space-between"
                                        align="center"
                                    >
                                        <HStack>
                                            <Avatar name={req.receiver_name || req.receiver_email} size="md" />
                                            <Box>
                                                <Text fontWeight="bold" fontSize="md">
                                                    {req.receiver_name || "未知使用者"}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    {req.receiver_email}
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </HStack>

                                ))
                            )}


                            <Box mt="4" /> {/* 分隔區域 */}

                            {/* 收到的邀請 */}
                            <Text fontSize="md" fontWeight="bold" mt="2">收到的邀請</Text>
                            {receivedFriendRequests.length === 0 ? (
                                <Text color="gray.500">目前沒有新的好友邀請</Text>
                            ) : (
                                receivedFriendRequests.map((req) => (
                                    <HStack
                                        key={req.id}
                                        p="10px"
                                        bg="gray.100"
                                        borderRadius="lg"
                                        justify="space-between"
                                        align="center"
                                    >
                                        <HStack>
                                            <Avatar name={req.sender_name || req.sender_email} size="md" />
                                            <Box>
                                                <Text fontWeight="bold" fontSize="md">
                                                    {req.sender_name || "未知使用者"}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    {req.sender_email}
                                                </Text>
                                            </Box>
                                        </HStack>

                                        <HStack>
                                            <Button
                                                colorScheme="green"
                                                size="sm"
                                                onClick={() => handleRespondToRequest(req.id, "accepted")}
                                            >
                                                接受
                                            </Button>
                                            <Button
                                                colorScheme="red"
                                                size="sm"
                                                onClick={() => handleRespondToRequest(req.id, "rejected")}
                                            >
                                                拒絕
                                            </Button>
                                        </HStack>
                                    </HStack>
                                ))
                            )}
                        </Box>
                    </HStack>
                </VStack>
            </Box>
        );
    };






    const renderChatContent = () => {
        const currentMessages = chatMessages[selectedFriend] || [];
        const isGroupChat = chatTargets.find(f => f.email === selectedFriend)?.status === "group";

        return (
            <Box flex="1" p="20px" overflowY="auto">
                {currentMessages.length === 0 ? (
                    <Box textAlign="center" mt="100px" color="gray.500">
                        <Text fontSize="xl">
                            {selectedFriend
                                ? `開始與 ${selectedFriend} 對話吧！`
                                : "選擇好友開始聊天"}
                        </Text>
                    </Box>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {currentMessages.map((msg, index) => {
                            const isMe = msg.sender === "You" || msg.sender === userEmail;
                            const getUserAvatarByEmail = (email) => {
                                const found = chatTargets.find(user => user.email === email || user.name === email);
                                return found?.img || null;
                            };

                            // ✅ 這裡加上 debug：看 msg.sender 是否為 email，找出來的 img 是不是正確
                            console.log("🧪 msg.sender:", msg.sender);
                            console.log("🧪 對應的頭像 URL:", getUserAvatarByEmail(msg.sender));

                            return (

                                <VStack
                                    key={index}
                                    align={isMe ? "flex-end" : "flex-start"}
                                    spacing={1}
                                    w="100%"
                                >
                                    {/* ✅ 顯示發話者名稱（非自己才顯示） */}
                                    {isGroupChat && !isMe && (
                                        <HStack align="center" pl="5px">
                                            <FriendAvatar
                                                name={getUserNameByEmail(msg.sender)}
                                                img={getUserAvatarByEmail(msg.sender)}
                                            />
                                            <Text fontSize="sm" fontWeight="bold" color="gray.600">
                                                {getUserNameByEmail(msg.sender)}
                                            </Text>
                                        </HStack>
                                    )}



                                    <Flex justify={isMe ? "flex-end" : "flex-start"} w="100%">
                                        <Box
                                            maxW="60%"
                                            bg={isMe ? "blue.500" : "gray.200"}
                                            color={isMe ? "white" : "black"}
                                            p="10px"
                                            borderRadius="md"
                                            borderTopRightRadius={isMe ? "0" : "md"}
                                            borderTopLeftRadius={isMe ? "md" : "0"}
                                        >
                                            <Text fontSize="sm">{msg.message || msg.content}</Text>
                                        </Box>
                                    </Flex>

                                    {/* 時間 */}
                                    {msg.timestamp && (
                                        <Text
                                            fontSize="xs"
                                            color="gray.500"
                                            px="5px"
                                            textAlign={isMe ? "right" : "left"}
                                            w="100%"
                                        >
                                            {new Date(
                                                msg.timestamp?.seconds
                                                    ? msg.timestamp.seconds * 1000
                                                    : msg.timestamp
                                            ).toLocaleTimeString("zh-TW", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                    )}
                                </VStack>

                            );
                        })}
                    </VStack>
                )}

                {/* 如果是 Meetsure機器人 顯示預設問題選單 */}
                {selectedFriend === "Meetsure機器人" && (
                    <Box

                    >
                        <HStack spacing={6} justify="center" p={5}>
                            {/* 建立專案 */}
                            <Box
                                as="button"
                                onClick={() => handleQuestionSelect("我要如何建立專案？")}
                                w="250px"
                                h="220px"
                                borderRadius="xl"
                                boxShadow="md"
                                bg="white"
                                textAlign="center"
                                _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                                transition="all 0.2s"
                            >
                                <VStack spacing={4} justify="center" h="100%">
                                    <Icon as={FaPlusCircle} w={12} h={12} color="teal.500" />
                                    <Text fontWeight="bold" fontSize="md" color="gray.800">
                                        我要如何建立專案？
                                    </Text>
                                </VStack>
                            </Box>

                            {/* 上傳失敗 */}
                            <Box
                                as="button"
                                onClick={() => handleQuestionSelect("我的影音檔案上傳失敗？")}
                                w="250px"
                                h="220px"
                                borderRadius="xl"
                                boxShadow="md"
                                bg="white"
                                textAlign="center"
                                _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                                transition="all 0.2s"
                            >
                                <VStack spacing={4} justify="center" h="100%">
                                    <Icon as={FaExclamationTriangle} w={12} h={12} color="orange.400" />
                                    <Text fontWeight="bold" fontSize="md" color="gray.800">
                                        我的影音檔案上傳失敗？
                                    </Text>
                                </VStack>
                            </Box>

                            {/* 網站功能 */}
                            <Box
                                as="button"
                                onClick={() => handleQuestionSelect("MeetSure網站有什麼主要功能？")}
                                w="250px"
                                h="220px"
                                borderRadius="xl"
                                boxShadow="md"
                                bg="white"
                                textAlign="center"
                                _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                                transition="all 0.2s"
                            >
                                <VStack spacing={4} justify="center" h="100%">
                                    <Icon as={FaTools} w={12} h={12} color="blue.500" />
                                    <Text fontWeight="bold" fontSize="md" color="gray.800">
                                        MeetSure網站有什麼主要功能？
                                    </Text>
                                </VStack>
                            </Box>
                        </HStack>


                    </Box>

                )}
            </Box>

        );
    };

    const handleQuestionSelect = (question) => {
        let response = "";

        if (question === "我要如何建立專案？") {
            response = `在 MeetSure 系統中，您可以按照以下步驟來建立專案：
            1. 點擊「我的專案」按鈕，進入專案列表頁面。
            2. 點擊「新建專案」按鈕，開始創建新的專案。
            3. 輸入專案名稱、目標和描述等基本信息。
            4. 選擇專案類型（例如：項目管理、會議記錄、媒體管理等）。
            5. 設置專案的進度條目標和階段（例如：開始、進行中、完成等）。
            6. 根據需求，添加相關的 Task、 Milestone 和文件等。
            7. 點擊「保存」按鈕，以儲存您的專案。`;
        } else if (question === "我的影音檔案上傳失敗？") {
            response = `如果您的影音檔案上傳失敗，可能是以下原因導致的：
            1. 檔案格式錯誤： MeetSure 支持的文件格式可能不包括您所選擇的檔案格式。請嘗試將檔案轉換為支持的格式（例如：MP4、AVI、MOV 等）。
            2. 檔案大小超過限制： MeetSure 上傳檔案大小限制可能已經超過您的檔案大小。您可以嘗試將檔案分割成多個小檔案上傳。`;
        } else if (question === "MeetSure網站有什麼主要功能？") {
            response = `MeetSure 是一個專案管理與 AI 支援平台，提供各式 AI 工具，包括：
            ChatGPT、智能寫作、AI翻譯等各式AI 工具支援
            會議轉錄：支援會議內容轉錄和摘要
            專案管理：讓使用者可以創建專案、管理進度、設定任務
            社群與聊天室：用戶可以與其他使用者交流、組建團隊
            檔案分享：允許團隊成員分享文件、發佈訊息`;

        }

        setChatMessages((prev) => ({
            ...prev,
            "Meetsure機器人": [
                ...(prev["Meetsure機器人"] || []),
                { sender: "You", content: question },
                { sender: "Meetsure機器人", content: response },
            ],
        }));

    };


    return (
        <Flex h="100vh" bg={backgroundColor} paddingTop="0px" overflow="hidden" position="relative"
            zIndex="10" borderRadius="20px" >
            {renderFriendsSidebar()}

            <Flex flex="1" direction="column" zIndex="1">
                <HStack
                    spacing={4}
                    bg="gray.100"
                    p="10px"
                    borderBottom="1px solid"
                    borderColor={borderColor}
                >
                    <Button
                        colorScheme={selectedTab === "chat" ? "teal" : "gray"}
                        onClick={() => setSelectedTab("chat")}
                    >
                        聊天
                    </Button>
                    <Button
                        colorScheme={selectedTab === "friends" ? "teal" : "gray"}
                        onClick={() => setSelectedTab("friends")}
                    >
                        好友清單
                    </Button>
                    <Button
                        colorScheme={selectedTab === "groups" ? "teal" : "gray"}
                        onClick={() => setSelectedTab("groups")}
                    >
                        群組
                    </Button>

                </HStack>

                {selectedTab === "chat" ? (
                    <>
                        {selectedFriend ? (
                            <Flex
                                align="center"
                                justify="space-between"
                                bg="gray.100"
                                p="10px"
                                borderBottom="1px solid"
                                borderColor={borderColor}
                            >
                                <HStack>
                                    <FriendAvatar
                                        name={friendsList.find(f => f.email === selectedFriend)?.name || selectedFriend}
                                        img={friendsList.find(f => f.email === selectedFriend)?.img}
                                    />





                                    {(() => {
                                        const friend = chatTargets.find(f => f.email === selectedFriend);

                                        if (!friend) return null;
                                        if (friend.status === "group") {
                                            return <Text fontWeight="bold" fontSize="lg">{friend.name}</Text>;
                                        } else {
                                            return (
                                                <Text fontWeight="bold" fontSize="lg">
                                                    {friend.name}（{friend.email || selectedFriend}）
                                                </Text>
                                            );
                                        }
                                    })()}


                                </HStack>
                                <IconButton
                                    size="md"
                                    colorScheme="gray"
                                    icon={<ViewIcon />}
                                    aria-label="檢視詳細資料"
                                />
                            </Flex>
                        ) : null}
                        {renderChatContent()}
                        <Flex p="10px" borderTop="1px solid" borderColor={borderColor}>
                            <Input
                                placeholder={
                                    selectedFriend ? "輸入訊息..." : "選擇好友後開始聊天"
                                }
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                isDisabled={!selectedFriend}
                            />
                            <Button
                                colorScheme="blue"
                                onClick={selectedFriend === "Meetsure機器人" ? handleSendMessage : handleSendMessage_F}
                                isDisabled={!selectedFriend}
                            >
                                傳送
                            </Button>

                        </Flex>
                    </>
                ) : selectedTab === "friends" ? (
                    renderFriendsList()
                ) : (
                    <GroupSection userEmail={userEmail} onGroupCreated={fetchGroups} />
                )}


            </Flex>

        </Flex>
    );
}


export default SocialPage;