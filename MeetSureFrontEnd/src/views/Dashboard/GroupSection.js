import React, { useState } from "react";
import {
    Box,
    Text,
    HStack,
    IconButton,
    Badge,
    AvatarGroup,
    Avatar,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Checkbox,
    VStack,
    SimpleGrid,
    useDisclosure,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { FaSitemap, FaUserFriends } from "react-icons/fa";
import { AddIcon } from "@chakra-ui/icons";

const GroupSection = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isCreateOpen,
        onOpen: openCreateModal,
        onClose: closeCreateModal,
    } = useDisclosure();

    const dummyGroups = [
        {
            id: "project-001",
            name: "輔仁大學第四十二屆專題 - 會議MeetSure",
            type: "project",
            leader: {
                name: "Tina",
                email: "tina@example.com"
            },
            members: [
                { name: "Tina", email: "tina@example.com" },
                { name: "Peter", email: "peter@example.com" },
                { name: "Tom", email: "tom@example.com" },
            ],
        },
        {
            id: "custom-001",
            name: "寫文件小隊",
            type: "custom",
            creator: { name: "你自己", email: "you@example.com" },
            members: [
                { name: "Alice", email: "alice@example.com" },
                { name: "Bob", email: "bob@example.com" },
                { name: "Charlie", email: "charlie@example.com" },
                { name: "Derek", email: "derek@example.com" },
            ],
        },
    ];

    const allUsers = [
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" },
        { name: "Charlie", email: "charlie@example.com" },
        { name: "Derek", email: "derek@example.com" },
        { name: "Eve", email: "eve@example.com" },
    ];

    const handleOpenModal = (group) => {
        setSelectedGroup(group);
        onOpen();
    };

    const handleToggleMember = (email) => {
        if (selectedMembers.includes(email)) {
            setSelectedMembers(selectedMembers.filter((e) => e !== email));
        } else {
            setSelectedMembers([...selectedMembers, email]);
        }
    };

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) {
            alert("請輸入群組名稱");
            return;
        }

        if (selectedMembers.length === 0) {
            alert("請選擇至少一位組員");
            return;
        }

        alert(`✅ 成功建立群組：${newGroupName}\n組員：${selectedMembers.join(", ")}`);
        setNewGroupName("");
        setSelectedMembers([]);
        closeCreateModal();
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
                        icon={<ChatIcon />}
                        size="sm"
                        aria-label="聊天"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`開啟與 ${group.name} 的群組聊天`);
                        }}
                    />
                </HStack>

                <HStack justify="space-between" align="center">
                    <AvatarGroup size="sm" max={3}>
                        {group.members.map((member, index) => (
                            <Avatar key={index} name={member.name} title={member.name} bg="gray.400" />
                        ))}
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
                    <Text fontSize="xl" fontWeight="bold">
                        群組清單
                    </Text>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="teal"
                        size="sm"
                        onClick={openCreateModal}
                    >
                        新增群組
                    </Button>
                </HStack>

                <SimpleGrid columns={[1, 2]} spacing={6} w="100%">
                    {dummyGroups.map((group) => renderGroupCard(group))}
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
                                {selectedGroup.type === "project" && selectedGroup.leader && (
                                    <Box>
                                        <Text fontWeight="bold" mb="1">專案組長</Text>
                                        <HStack bg="gray.50" p={2} borderRadius="md">
                                            <Avatar name={selectedGroup.leader.name} size="sm" />
                                            <Box>
                                                <Text fontWeight="medium">{selectedGroup.leader.name}</Text>
                                                <Text fontSize="sm" color="gray.500">{selectedGroup.leader.email}</Text>
                                            </Box>
                                        </HStack>
                                    </Box>
                                )}

                                {/* 🔹 創立者 (只有自創群組顯示) */}
                                {selectedGroup.type === "custom" && selectedGroup.creator && (
                                    <Box>
                                        <Text fontWeight="bold" mb="1">創立者</Text>
                                        <HStack bg="gray.50" p={2} borderRadius="md">
                                            <Avatar name={selectedGroup.creator.name} size="sm" />
                                            <Box>
                                                <Text fontWeight="medium">{selectedGroup.creator.name}</Text>
                                                <Text fontSize="sm" color="gray.500">{selectedGroup.creator.email}</Text>
                                            </Box>
                                        </HStack>
                                    </Box>
                                )}

                                {/* 🔹 群組成員列表 */}
                                <Box>
                                    <Text fontWeight="bold" mb="1">群組成員</Text>
                                    <VStack align="start" spacing={2}>
                                        {selectedGroup.members.map((member, index) => (
                                            <HStack key={index} bg="gray.50" p={2} borderRadius="md" w="100%">
                                                <Avatar name={member.name} size="sm" />
                                                <Box>
                                                    <Text fontWeight="medium">{member.name}</Text>
                                                    <Text fontSize="sm" color="gray.500">{member.email}</Text>
                                                </Box>
                                            </HStack>
                                        ))}
                                    </VStack>
                                </Box>
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
                                    {allUsers.map((user) => {
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
