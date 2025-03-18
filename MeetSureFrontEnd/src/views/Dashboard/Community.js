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
} from "@chakra-ui/react";
import { ChatIcon, StarIcon, DeleteIcon, ViewIcon, } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import MeetSureLogo from "assets/img/MeetSureLogo.jpg"; // 匯入你的圖片
import axios from "axios";



function SocialPage() {
    const backgroundColor = useColorModeValue("white");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const sidebarBg = useColorModeValue("gray.100", "gray.800");

    const [selectedTab, setSelectedTab] = useState("chat");
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [chatMessages, setChatMessages] = useState({
        general: [],
        Charlie: [],
        Dana: [],
        Eve: [],
        "Meetsure機器人": [{ sender: "Meetsure機器人", content: "您好！請選擇您想問的問題：" },
        ], // 新增一個MeetSure機器人的訊息數組

    });

    const [friendsList, setFriendsList] = useState([{ name: "Meetsure機器人", status: "auto-reply" }]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [newFriendEmail, setNewFriendEmail] = useState("");
    const userEmail = localStorage.getItem("user_email");
    const [sentFriendRequests, setSentFriendRequests] = useState([]);
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);


    // ✅ **獲取好友列表**
    const fetchFriends = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/friends/?user_email=${userEmail}`);
            console.log("🔥 來自 API 的好友列表:", response.data);

            if (response.data.friends) {
                setFriendsList([{ name: "Meetsure機器人", status: "auto-reply" }, ...response.data.friends]);
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

    // ✅ **確保 `fetchFriends` 和 `fetchFriendRequests` 會在 `userEmail` 變更時觸發**
    useEffect(() => {
        fetchFriends();
        fetchFriendRequests();
    }, [userEmail]);




    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (inputValue.trim() === "") return;

        setChatMessages((prevMessages) => ({
            ...prevMessages,
            [selectedFriend || "general"]: [
                ...prevMessages[selectedFriend || "general"],
                { sender: "You", content: inputValue },
            ],
        }));
        setInputValue("");
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
                    {friendsList.map((friend) => (
                        <HStack
                            key={friend.name}
                            p="10px"
                            bg="gray.100"
                            borderRadius="lg"
                            _hover={{ bg: "gray.200" }}
                            justify="space-between"
                            cursor="pointer"
                            onClick={() => setSelectedFriend(friend.name)}
                        >
                            <HStack>
                                <Avatar
                                    name={friend.name}
                                    src={friend.name === "Meetsure機器人" ? MeetSureLogo : null} // 自定義頭像
                                    bg={friend.name === "Meetsure機器人" ? "transparent" : undefined} // 只有Meetsure機器人設置透明背景
                                />
                                <Box>
                                    {/* 顯示名稱為黑色 */}
                                    <Text fontWeight="bold" color="black" noOfLines={1} whiteSpace="nowrap">
                                        {friend.name}
                                    </Text>
                                    {/* 根據名稱顯示不同狀態 */}
                                    <Badge
                                        colorScheme={
                                            friend.name === "Meetsure機器人" ? "gray" : friend.status === "online" ? "green" : "gray"
                                        }
                                    >
                                        {friend.name === "Meetsure機器人" ? "自動回覆" : friend.status === "online" ? "在線" : "離線"}
                                    </Badge>
                                </Box>
                            </HStack>
                            {friend.name === "Meetsure機器人" && (
                                <IconButton
                                    size="sm"
                                    icon={<StarIcon color="blue.500" />} // 設置星星的顏色為藍色
                                    aria-label="Star"
                                    bg="transparent" // 設置背景為透明
                                    _hover={{ bg: "transparent" }} // 鼠標懸停時保持背景透明
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
                    <HStack p="10px" bg="gray.100" borderRadius="lg">
                        <Input placeholder="輸入好友 Email" value={newFriendEmail}
                            onChange={(e) => setNewFriendEmail(e.target.value)} />
                        <Button colorScheme="blue" onClick={handleSendFriendRequest}>發送邀請</Button>
                    </HStack>

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
                                            <Avatar name={friend.name} />
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
                                                colorScheme="blue"
                                                icon={<ChatIcon />}
                                                aria-label="聊天"
                                                onClick={() => {
                                                    setSelectedTab("chat");
                                                    setSelectedFriend(friend.name);
                                                }}
                                            />
                                            <IconButton
                                                size="md"
                                                colorScheme="red"
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
                                    <HStack key={req.id} p="10px" bg="gray.100" borderRadius="lg">
                                        <Text>已送出給 {req.receiver_name || req.receiver_email}</Text>
                                        <Button colorScheme="red" size="sm"
                                            onClick={() => handleCancelFriendRequest(req.id)}>
                                            取消邀請
                                        </Button>
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
                                    <HStack key={req.id} p="10px" bg="gray.100" borderRadius="lg">
                                        <Text>{req.sender_email} 想加你為好友</Text>
                                        <Button colorScheme="green" size="sm"
                                            onClick={() => handleRespondToRequest(req.id, "accepted")}>
                                            接受
                                        </Button>
                                        <Button colorScheme="red" size="sm"
                                            onClick={() => handleRespondToRequest(req.id, "rejected")}>
                                            拒絕
                                        </Button>
                                    </HStack>
                                ))
                            )}
                        </Box>
                    </HStack>
                </VStack>
            </Box>
        );
    };


    //聊天室內容
    const renderChatContent = () => {
        const currentMessages = chatMessages[selectedFriend] || []; // ✅ 避免 undefined

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
                        {currentMessages.map((msg, index) => (
                            <Flex
                                key={index}
                                justify={msg.sender === "You" ? "flex-end" : "flex-start"}
                            >
                                <Box
                                    maxW="60%"
                                    bg={msg.sender === "You" ? "blue.500" : "gray.300"}
                                    color={msg.sender === "You" ? "white" : "black"}
                                    p="10px"
                                    borderRadius="md"
                                    mb="4px"
                                >
                                    <Text>{msg.content}</Text>
                                </Box>
                            </Flex>
                        ))}
                    </VStack>
                )}

                {/* 如果是MeetSure機器人顯示問題選項 */}
                {selectedFriend === "Meetsure機器人" && (
                    <Box mt="20px">
                        <Text fontWeight="bold" color="gray.700">請選擇一個問題：</Text>
                        <VStack spacing={4} align="stretch">
                            <Button
                                colorScheme="teal"
                                onClick={() => handleQuestionSelect("如何使用本平台？")}
                            >
                                如何使用本平台？
                            </Button>
                            <Button
                                colorScheme="teal"
                                onClick={() => handleQuestionSelect("有關隱私政策的問題")}
                            >
                                有關隱私政策的問題
                            </Button>
                            <Button
                                colorScheme="teal"
                                onClick={() => handleQuestionSelect("如何修改個人資料？")}
                            >
                                如何修改個人資料？
                            </Button>
                        </VStack>
                    </Box>
                )}
            </Box>
        );
    };

    const handleQuestionSelect = (question) => {
        setChatMessages((prevMessages) => ({
            ...prevMessages,
            "Meetsure機器人": [
                ...prevMessages["Meetsure機器人"],
                { sender: "You", content: question },
                { sender: "Meetsure機器人", content: `您選擇的問題是：${question}` },
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
                                    <Avatar name={selectedFriend} />
                                    <Text fontWeight="bold" fontSize="lg">
                                        {selectedFriend}
                                    </Text>
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
                                onClick={handleSendMessage}
                                isDisabled={!selectedFriend}
                            >
                                傳送
                            </Button>
                        </Flex>
                    </>
                ) : (
                    renderFriendsList()
                )}

            </Flex>

        </Flex>
    );
}

export default SocialPage;