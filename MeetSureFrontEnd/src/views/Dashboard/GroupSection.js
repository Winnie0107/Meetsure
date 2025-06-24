import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box, Text, HStack, IconButton, Badge, AvatarGroup, Avatar, Icon, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    ModalFooter, Button, Input, VStack, SimpleGrid, useDisclosure, useToast
} from "@chakra-ui/react";
import { ChatIcon, AddIcon } from "@chakra-ui/icons";
import { FaSitemap, FaUserFriends } from "react-icons/fa";
import { WarningIcon } from "@chakra-ui/icons";
import getAvatarUrl from "../../components/Icons/getAvatarUrl";



const GroupSection = () => {
    const [groupList, setGroupList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isCreateOpen,
        onOpen: openCreateModal,
        onClose: closeCreateModal,
    } = useDisclosure();
    const toast = useToast();

    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("user_email");



    // ✅ 取得群組清單
    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/groups/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setGroupList(res.data);
        } catch (err) {
            console.error("❌ 無法取得群組清單:", err);
        }
    };

    // ✅ 取得好友列表
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/friends/`, {
                params: { user_email: userEmail },  // ⬅️ 加上這個
                headers: { Authorization: `Token ${token}` },
            });
            setUserList(res.data.friends);  // ⬅️ 注意這裡要改成 res.data.friends
        } catch (err) {
            console.error("❌ 無法取得好友清單:", err);
        }
    };


    useEffect(() => {
        fetchGroups();
        fetchUsers();
    }, []);

    const handleOpenModal = (group) => {
        setSelectedGroup(group);
        onOpen();
    };

    const handleToggleMember = (email) => {
        setSelectedMembers((prev) =>
            prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
        );
    };

    // ✅ 建立自創群組
    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            toast({ title: "請輸入群組名稱", status: "warning" });
            return;
        }
        if (selectedMembers.length === 0) {
            toast({ title: "請選擇至少一位組員", status: "warning" });
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/groups/create/`,
                {
                    name: newGroupName,
                    members: selectedMembers,
                },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            toast({ title: "成功建立群組", status: "success" });
            setNewGroupName("");
            setSelectedMembers([]);
            closeCreateModal();
            fetchGroups(); // 🔄 重新取得群組
        } catch (err) {
            console.error("❌ 建立群組失敗:", err);
            toast({ title: "建立群組失敗", status: "error" });
        }
    };

    const renderGroupCard = (group) => {
        const label = group.type === "project" ? "專案群組" : "自創群組";
        const colorScheme = group.type === "project" ? "blue" : "red";
        const bgColor = group.type === "project" ? "blue.50" : "purple.50";
        const icon = group.type === "project" ? FaSitemap : FaUserFriends;

        return (
            <Box
                key={group.id}
                bg={bgColor}
                p="6"
                borderRadius="md"
                boxShadow="sm"
                cursor="pointer"
                _hover={{ boxShadow: "md", transform: "scale(1.01)", transition: "0.2s" }}
                onClick={() => handleOpenModal(group)}
            >
                <HStack justify="space-between" mb="3">
                    <HStack>
                        <Icon as={icon} color="gray.600" boxSize={5} ml="1" mr="1" />
                        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                            {group.name}
                        </Text>
                    </HStack>
                    <IconButton
                        size="md"
                        bg="rgba(49, 130, 206, 0.67)"
                        icon={<ChatIcon />}
                        aria-label="聊天"
                        onClick={(e) => {
                            e.stopPropagation();
                            // ❗ 這段只有當 GroupSection 是嵌在 Community.js 中才有效
                            const setChat = new CustomEvent("start-group-chat", {
                                detail: { friendName: group.name }
                            });
                            window.dispatchEvent(setChat);
                        }}

                    />
                </HStack>

                <HStack justify="space-between" align="center">
                    <AvatarGroup size="sm" max={3}>
                        {group.members.map((member, index) => {
                            console.log("👤 群組成員頭貼檢查：", {
                                name: member.name,
                                email: member.email,
                                img: member.img,
                                resolvedUrl: getAvatarUrl(member.img),
                            });

                            return (
                                <Avatar
                                    key={index}
                                    name={member.name}
                                    title={member.email}
                                    src={getAvatarUrl(member.img)}
                                />
                            );
                        })}
                    </AvatarGroup>


                    <Badge colorScheme={colorScheme} fontSize="sm" px="2" py="1">
                        {label}
                    </Badge>
                </HStack>
            </Box>
        );
    };

    return (
        <Box p="20px">
            <VStack align="start" spacing={6}>
                <HStack w="100%" justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">群組清單</Text>
                    <Button leftIcon={<AddIcon />} colorScheme="teal" size="sm" onClick={openCreateModal}>
                        新增群組
                    </Button>
                </HStack>

                <SimpleGrid columns={[1, 2]} spacing={6} w="100%">
                    {groupList.map((group) => renderGroupCard(group))}
                </SimpleGrid>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent p={4} borderRadius="25px" maxW="650px">
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedGroup && (
                            <VStack align="stretch" spacing={4}>
                                {/* 🔹 群組名稱 + 類型 */}
                                <Box>
                                    <HStack align="center" spacing="2" mb="1">
                                        <Text fontWeight="bold" fontSize="lg">群組名稱</Text>
                                        <Badge
                                            fontSize="sm"
                                            colorScheme={selectedGroup.type === "project" ? "blue" : "red"}
                                            px={2}
                                            py={0.5}
                                        >
                                            {selectedGroup.type === "project" ? "專案群組" : "自創群組"}
                                        </Badge>
                                    </HStack>

                                    <Input
                                        value={selectedGroup.name}
                                        isReadOnly={selectedGroup.type === "project"} // ✅ 專案群組不可編輯
                                        onChange={(e) =>
                                            setSelectedGroup({
                                                ...selectedGroup,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </Box>

                                {/* 🔹 專案組長（僅專案群組顯示） */}
                                {selectedGroup.type === "project" && selectedGroup.owner && (
                                    <Box>
                                        <Text fontWeight="bold" mb="1">專案組長</Text>
                                        <HStack bg="gray.50" p={2} borderRadius="md">
                                            <Avatar
                                                name={selectedGroup.owner.name}
                                                src={getAvatarUrl(selectedGroup.owner.img)}
                                                size="sm"
                                            />
                                            <Box>
                                                <Text fontWeight="medium">{selectedGroup.owner.name}</Text>
                                                <Text fontSize="sm" color="gray.500">{selectedGroup.owner.email}</Text>
                                            </Box>
                                        </HStack>
                                    </Box>
                                )}


                                {/* 🔹 創立者（只有自創群組顯示） */}
                                {selectedGroup.type === "custom" && selectedGroup.owner && (
                                    <Box>
                                        <Text fontWeight="bold" mb="1">創立者</Text>
                                        <HStack bg="gray.50" p={2} borderRadius="md">
                                            <Avatar
                                                name={selectedGroup.owner.name}
                                                src={getAvatarUrl(selectedGroup.owner.img)}
                                                size="sm"
                                            />
                                            <Box>
                                                <Text fontWeight="medium">{selectedGroup.owner.name}</Text>
                                                <Text fontSize="sm" color="gray.500">{selectedGroup.owner.email}</Text>
                                            </Box>
                                        </HStack>
                                    </Box>
                                )}

                                {/* 🔹 群組成員列表 */}
                                <Box>
                                    <Text fontWeight="bold" mb="1">群組成員</Text>
                                    <VStack align="start" spacing={2} mb="4">
                                        {selectedGroup.members
                                            .filter((member) => member.email !== selectedGroup.owner?.email)
                                            .map((member, index) => (
                                                <HStack key={index} bg="gray.50" p={2} borderRadius="md" w="100%">
                                                    <Avatar
                                                        name={member.name}
                                                        src={getAvatarUrl(member.img)}
                                                        size="sm"
                                                    />
                                                    <Box>
                                                        <Text fontWeight="medium">{member.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">{member.email}</Text>
                                                    </Box>
                                                </HStack>
                                            ))}
                                    </VStack>
                                </Box>

                                {selectedGroup.type === "project" && (
                                    <Box bg="teal.50" borderRadius="md" p={3}>
                                        <HStack spacing={2}>
                                            <WarningIcon color="gray.400" boxSize={5} />
                                            <Text fontSize="sm" color="black">
                                                此群組與專案綁定，內容資訊會與專案同步
                                            </Text>
                                        </HStack>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>



            <Modal isOpen={isCreateOpen} onClose={closeCreateModal} size="md">
                <ModalOverlay />
                <ModalContent p={4} borderRadius="25px" maxW="650px">
                    <ModalHeader>建立新群組</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            {/* 🔹 群組名稱 + 類型 */}
                            <Box>
                                <HStack align="center" spacing="2" mb="1">
                                    <Text fontWeight="bold">群組名稱</Text>
                                    <Badge colorScheme="red" fontSize="sm" px={2} py={0.5}>自創群組</Badge>
                                </HStack>
                                <Input
                                    placeholder="請輸入群組名稱"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                            </Box>

                            {/* 🔹 選擇組員（卡片樣式） */}
                            <Box>
                                <Text fontWeight="bold" mb="2">選擇組員</Text>
                                <VStack align="stretch" spacing={3}>
                                    {userList.map((user) => {
                                        const isSelected = selectedMembers.includes(user.email);
                                        return (
                                            <HStack
                                                key={user.email}
                                                bg="gray.50"
                                                p={3}
                                                borderRadius="lg"
                                                justify="space-between"
                                            >
                                                <HStack>
                                                    <Avatar name={user.name} />
                                                    <Box>
                                                        <Text fontWeight="semibold">{user.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">{user.email}</Text>
                                                    </Box>
                                                </HStack>
                                                <Button
                                                    size="sm"
                                                    colorScheme={isSelected ? "red" : "blue"}
                                                    onClick={() => handleToggleMember(user.email)}
                                                >
                                                    {isSelected ? "移除" : "加入"}
                                                </Button>
                                            </HStack>
                                        );
                                    })}
                                </VStack>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleCreateGroup}>建立</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    );
};

export default GroupSection;
