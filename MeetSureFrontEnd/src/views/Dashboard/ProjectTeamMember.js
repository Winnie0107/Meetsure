import React, { useEffect, useState } from "react";
import {
    Icon,
    Flex,
    Box,
    Text,
    VStack,
    HStack,
    Badge,
    Avatar,
    useColorModeValue,
    Spinner,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { BellIcon } from "@chakra-ui/icons";
import { FaTasks, FaCommentDots, FaFolderOpen } from "react-icons/fa";
import { MdGraphicEq } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";


function ProjectTeamMember() {
    const { id: projectId } = useParams();
    const [members, setMembers] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMemberToRemove, setSelectedMemberToRemove] = useState(null);
    const [selectedFriendToAdd, setSelectedFriendToAdd] = useState(null);
    const {
        isOpen: isRemoveOpen,
        onOpen: onRemoveOpen,
        onClose: onRemoveClose,
    } = useDisclosure();
    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose,
    } = useDisclosure();

    const boxBg = useColorModeValue("white", "gray.800");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/project-members/?project_id=${projectId}`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                setMembers(response.data || []);
            } catch (error) {
                console.error("❌ 無法取得專案成員：", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [projectId]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/friends/?user_email=${localStorage.getItem("user_email")}`
                );
                setFriendsList(response.data.friends || []);
            } catch (error) {
                console.error("❌ 無法取得好友列表：", error);
            }
        };
        fetchFriends();
    }, []);

    const handleConfirmRemoveMember = async () => {
        if (!selectedMemberToRemove) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/api/project-members/remove/`, {
                data: {
                    project_id: projectId,
                    user_email: selectedMemberToRemove.email,
                },
                headers: { Authorization: `Token ${token}` },
            });
            setMembers(members.filter(m => m.email !== selectedMemberToRemove.email));
            onRemoveClose();
        } catch (error) {
            console.error("❌ 移除成員失敗：", error);
        }
    };

    const handleConfirmAddMember = async () => {
        if (!selectedFriendToAdd) return;
        try {
            const token = localStorage.getItem("token");

            console.log("🛠️ project_id:", projectId);
            console.log("🛠️ user_id:", selectedFriendToAdd.id);  // ✅ 改這裡為小寫 id

            await axios.post(`http://127.0.0.1:8000/api/project-members/add/`, {
                project_id: projectId,
                user_id: selectedFriendToAdd.id,  // ✅ 正確傳值
            }, {
                headers: { Authorization: `Token ${token}` }
            });

            const updatedMembers = await axios.get(
                `http://127.0.0.1:8000/api/project-members/?project_id=${projectId}`,
                { headers: { Authorization: `Token ${token}` } }
            );
            setMembers(updatedMembers.data || []);
            onAddClose();
        } catch (error) {
            console.error("❌ 加入成員失敗：", error);
        }
    };


    return (
        <Card flex="1" p="6" bg="white" boxShadow="lg" minHeight="535px">
            <CardHeader pb="4">
                <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold"> 專案成員管理</Text>
                </Flex>
            </CardHeader>

            <HStack spacing={6} align="stretch" w="100%" mt={4}>

                <Box flex="1" minW="0">
                    <Card bg="white" p="6" boxShadow="lg" height="100%" minH="550px">
                        <CardHeader pb="4">
                            <Flex justify="space-between" align="center">
                                <Text fontSize="lg" fontWeight="bold">專案成員列表</Text>
                            </Flex>
                        </CardHeader>
                        {loading ? (
                            <Spinner />
                        ) : members.length === 0 ? (
                            <Text color="gray.500">目前沒有加入的成員</Text>
                        ) : (
                            <VStack spacing={3} align="stretch">
                                {members.map(member => (
                                    <HStack
                                        key={member.email}
                                        p="10px"
                                        bg="gray.100"
                                        borderRadius="lg"
                                        justify="space-between"
                                        align="center"
                                    >
                                        <HStack>
                                            <Avatar name={member.name} src={member.img || undefined} size="md" />
                                            <Box>
                                                <Text fontWeight="bold">{member.name || "未命名用戶"}</Text>
                                                <Text fontSize="sm" color="gray.600">{member.email}</Text>
                                            </Box>
                                        </HStack>

                                        <Button size="sm" colorScheme="red" onClick={() => {
                                            setSelectedMemberToRemove(member);
                                            onRemoveOpen();
                                        }}>移除</Button>
                                    </HStack>
                                ))}
                            </VStack>
                        )}
                    </Card>
                </Box>

                {/* 右側：新增好友成員 */}
                <Box flex="1" minW="0">
                    <Card bg="white" p="6" boxShadow="lg" height="100%">

                        <CardHeader pb="4">
                            <Flex justify="space-between" align="center">
                                <Text fontSize="lg" fontWeight="bold">新增好友到專案</Text>
                            </Flex>
                        </CardHeader>
                        <Box p="2" maxH="75vh" overflowY="auto">
                            {friendsList.length === 0 ? (
                                <Text color="gray.500">你目前沒有好友</Text>
                            ) : (
                                <VStack spacing={3} align="stretch">
                                    {friendsList
                                        .filter(friend => !members.some(m => m.email === friend.email))
                                        .map(friend => (
                                            <HStack
                                                key={friend.email}
                                                p="10px"
                                                bg="gray.100"
                                                borderRadius="lg"
                                                justify="space-between"
                                                align="center"
                                            >
                                                <HStack>
                                                    <Avatar name={friend.name} src={friend.img || undefined} size="md" />
                                                    <Box>
                                                        <Text fontWeight="bold">{friend.name}</Text>
                                                        <Text fontSize="sm" color="gray.600">{friend.email}</Text>
                                                    </Box>
                                                </HStack>
                                                <Button size="sm" colorScheme="blue" onClick={() => {
                                                    setSelectedFriendToAdd(friend);
                                                    onAddOpen();
                                                }}>加入</Button>
                                            </HStack>
                                        ))}
                                </VStack>
                            )}
                        </Box>
                    </Card>
                </Box>
            </HStack>

            <Modal isOpen={isRemoveOpen} onClose={onRemoveClose}>
                <ModalOverlay />
                <ModalContent p={4} borderRadius="25px">
                    <ModalHeader>確認移除組員</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight="medium">
                            您即將移除 <strong>{selectedMemberToRemove?.name || selectedMemberToRemove?.email}</strong> 出此專案。
                            <br /><br />
                            此操作不會刪除好友，您仍可再次邀請他加入。
                            <br />
                            請再次確認是否要將此組員移出專案。
                        </Text>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onRemoveClose}>取消</Button>
                        <Button colorScheme="red" onClick={handleConfirmRemoveMember}>確認移除</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isAddOpen} onClose={onAddClose}>
                <ModalOverlay />
                <ModalContent p={4} borderRadius="25px" maxW="650px">
                    <ModalHeader>確認將好友 {selectedFriendToAdd?.name || selectedFriendToAdd?.email} 加入此專案嗎？</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Text fontSize="md" color="gray.700" mb={5}>
                            用戶成為專案組員後，將可以瀏覽並操作此專案的所有內容，包含任務、會議、討論與檔案，請確認是否邀請。
                        </Text>

                        <Flex justify="center" gap={8} wrap="wrap" mb={4}>
                            <VStack spacing={2} w="140px" textAlign="center">
                                <BellIcon boxSize={7} color="teal.500" />
                                <Text fontSize="md" fontWeight="semibold">即時通知</Text>
                            </VStack>
                            <VStack spacing={2} w="140px" textAlign="center">
                                <FaTasks size={28} color="#319795" />
                                <Text fontSize="md" fontWeight="semibold">任務追蹤</Text>
                            </VStack>
                            <VStack spacing={2} w="140px" textAlign="center">
                                <MdGraphicEq size={28} color="#319795" />
                                <Text fontSize="md" fontWeight="semibold">會議紀錄分析</Text>
                            </VStack>
                            <VStack spacing={2} w="140px" textAlign="center">
                                <FaCommentDots size={26} color="#319795" />
                                <Text fontSize="md" fontWeight="semibold">討論區協作</Text>
                            </VStack>
                            <VStack spacing={2} w="140px" textAlign="center">
                                <FaFolderOpen size={26} color="#319795" />
                                <Text fontSize="md" fontWeight="semibold">檔案共享</Text>
                            </VStack>
                        </Flex>

                        <HStack align="center" spacing={3} mt={3}>
                            <Icon as={FaCheckCircle} color="teal.500" boxSize={5} />
                            <Text fontSize="md" color="gray.700">
                                成員加入後可即時參與所有項目，協助專案順利推進。
                            </Text>
                        </HStack>

                    </ModalBody>


                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onAddClose}>取消</Button>
                        <Button colorScheme="blue" onClick={handleConfirmAddMember}>確認加入</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
}

export default ProjectTeamMember;
