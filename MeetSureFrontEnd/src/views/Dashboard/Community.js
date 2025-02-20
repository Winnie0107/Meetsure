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
    Checkbox,

} from "@chakra-ui/react";
import { ChatIcon, StarIcon, DeleteIcon, ViewIcon, CheckIcon, AddIcon, } from "@chakra-ui/icons";
import React, { useState } from "react";
import MeetSureLogo from "assets/img/MeetSureLogo.jpg"; // 匯入你的圖片



function SocialPage() {
    const backgroundColor = useColorModeValue("gray.50", "gray.900");
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
    const [friendsList, setFriendsList] = useState([
        { name: "Meetsure機器人", status: "auto-reply" }, // 將MeetSure機器人加入
        { name: "Charlie", status: "online" },
        { name: "Dana", status: "offline" },
        { name: "Eve", status: "online" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [newFriendName, setNewFriendName] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupName, setGroupName] = useState("");
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
    const { isOpen: isAddFriendModalOpen, onOpen: onOpenAddFriendModal, onClose: onCloseAddFriendModal } = useDisclosure();

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

    const handleDeleteFriend = (friendName) => {
        setFriendsList((prevList) =>
            prevList.filter((friend) => friend.name !== friendName)
        );
        if (selectedFriend === friendName) setSelectedFriend(null);
    };

    const handleAddFriend = () => {
        if (!newFriendName.trim()) return;

        if (friendsList.some((friend) => friend.name === newFriendName.trim())) {
            alert("該好友已存在！");
            return;
        }

        setFriendsList((prevList) => [
            ...prevList,
            { name: newFriendName.trim(), status: "offline" },
        ]);

        setNewFriendName("");
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            alert("請輸入群組名稱！");
            return;
        }

        if (selectedGroupMembers.length === 0) {
            alert("請選擇至少一位成員！");
            return;
        }

        console.log("群組名稱:", groupName);
        console.log("群組成員:", selectedGroupMembers);
        setGroupName("");
        setSelectedGroupMembers([]);
        onClose();
    };

    const toggleGroupMember = (friendName) => {
        setSelectedGroupMembers((prev) => {
            if (prev.includes(friendName)) {
                return prev.filter((name) => name !== friendName);
            } else {
                return [...prev, friendName];
            }
        });
    };

    //創建群組彈跳視窗
    const renderAddFriendField = () => {
        return (
            <VStack spacing={6} align="stretch" p={4} bg="gray.50" borderRadius="lg" shadow="lg">
                <Box textAlign="center" mb={4}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        新增好友或創建群組
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        快速擴充你的社交圈
                    </Text>
                </Box>

                <HStack
                    spacing={4}
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    shadow="sm"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <Input
                        placeholder="輸入好友名稱"
                        value={newFriendName}
                        onChange={(e) => setNewFriendName(e.target.value)}
                        borderRadius="lg"
                        _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    />
                    <Button
                        colorScheme="blue"
                        borderRadius="lg"
                        leftIcon={<AddIcon />}
                        onClick={handleAddFriend}
                    >
                        新增
                    </Button>
                </HStack>

                <HStack
                    spacing={4}
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    shadow="sm"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <Input
                        placeholder="輸入群組名稱"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        borderRadius="lg"
                        _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px green.400" }}
                    />
                    <Button
                        colorScheme="green"
                        borderRadius="lg"
                        leftIcon={<CheckIcon />}
                        onClick={onOpen}
                    >
                        創建
                    </Button>
                </HStack>

                <Box
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    shadow="sm"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <Text fontWeight="bold" fontSize="lg" color="gray.700" mb={4}>
                        你可能認識的好友
                    </Text>
                    <VStack spacing={3} align="stretch">
                        <HStack
                            p={3}
                            bg="gray.100"
                            borderRadius="lg"
                            _hover={{ bg: "gray.200" }}
                            transition="background-color 0.2s"
                        >
                            <Avatar size="sm" name="推薦好友" />
                            <Text fontSize="sm" color="gray.700">
                                推薦好友名稱
                            </Text>
                        </HStack>
                    </VStack>
                </Box>
            </VStack>
        );
    };

    //創建群組彈跳視窗內容
    const renderCreateGroupModal = () => {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>創建群組</ModalHeader>
                    <ModalBody>
                        <Text mb="4">選擇成員：</Text>
                        <VStack align="start">
                            {friendsList.map((friend) => (
                                <Checkbox
                                    key={friend.name}
                                    isChecked={selectedGroupMembers.includes(friend.name)}
                                    onChange={() => toggleGroupMember(friend.name)}
                                >
                                    {friend.name}
                                </Checkbox>
                            ))}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCreateGroup}>
                            確認創建
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            取消
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
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



    //好友清單
    const renderFriendsList = () => {
        return (
            <Box flex="1" p="20px" overflowY="auto">
                <VStack spacing={4} align="stretch">
                    {friendsList.map((friend) => (
                        <HStack
                            key={friend.name}
                            p="10px"
                            bg="gray.100"
                            borderRadius="lg"
                            justify="space-between"
                            alignItems="center"
                        >
                            <HStack>
                                <Avatar name={friend.name} />
                                <Box>
                                    <Text fontWeight="bold" color={textColor}>
                                        {friend.name}
                                    </Text>
                                    <Badge
                                        colorScheme={
                                            friend.status === "online" ? "green" : "gray"
                                        }
                                    >
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
                                    onClick={() => handleDeleteFriend(friend.name)}
                                />
                            </HStack>
                        </HStack>
                    ))}
                </VStack>
            </Box>
        );
    };

    //聊天室內容
    const renderChatContent = () => {
        const currentMessages = chatMessages[selectedFriend || "general"];

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


    //最上方按鈕
    return (
        <Flex h="100vh" bg={backgroundColor} paddingTop="0px" overflow="hidden" position="relative"
            zIndex="10" borderRadius="lg">
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
                {/* 右下角Add按鈕 */}
                <IconButton
                    size="lg"
                    colorScheme="teal"
                    icon={<AddIcon />}
                    aria-label="新增"
                    position="fixed"
                    bottom="20px"
                    right="20px"
                    onClick={onOpenAddFriendModal}
                />
            </Flex>



            {/* Add Friend Modal */}
            <Modal isOpen={isAddFriendModalOpen} onClose={onCloseAddFriendModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        {renderAddFriendField()}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {renderCreateGroupModal()}
        </Flex>
    );
}

export default SocialPage;
