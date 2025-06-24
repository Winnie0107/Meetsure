import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Input,
    List,
    ListItem,
    IconButton,
    Text,
    Flex,
    VStack,
    useColorModeValue,
    Avatar,
    HStack,
    Textarea,
    Image,
    Spinner,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import BuildProjectImage from "assets/img/buildproject.png";
import getAvatarUrl from "components/Icons/getAvatarUrl";


function ProjectSelectMembers({ onNext, handleStepClick, currentStep, projectData, setProjectData, userEmail }) {
    const textColor = useColorModeValue("gray.700", "white");
    const [friendsList, setFriendsList] = useState([]); // 🆕 從後端獲取好友
    const [loading, setLoading] = useState(true); // 🆕 顯示載入狀態

    // ✅ **獲取好友列表**
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/friends/?user_email=${userEmail}`);
                console.log("🔥 來自 API 的好友列表:", response.data);

                if (response.data.friends) {
                    setFriendsList([{ name: "Meetsure機器人", status: "auto-reply" }, ...response.data.friends]);
                }

                // ✅ **獲取自己的資料**
                const responseUser = await axios.get(`${process.env.REACT_APP_API_URL}/users/?email=${userEmail}`);
                const currentUser = responseUser.data;

                if (currentUser && currentUser.id && currentUser.name) {
                    setProjectData(prevData => ({
                        ...prevData,
                        members: [{ id: currentUser.id, name: currentUser.name,img: localStorage.getItem("user_img") || null }, ...prevData.members]
                    }));
                } else {
                    console.warn("⚠️ 無法獲取登入用戶資料:", currentUser);
                }

            } catch (error) {
                console.error("❌ 獲取好友列表失敗:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userEmail]);

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const userEmail = localStorage.getItem("user_email");
        const userName = localStorage.getItem("username");

        if (!userId) {
            console.warn("⚠️ 找不到 `user_id`，無法將自己加入 members！");
            return;
        }

        console.log("✅ 取得登入用戶:", { id: userId, name: userName });

        setProjectData(prevData => ({
            ...prevData,
            members: [{ id: parseInt(userId), name: userName,img: localStorage.getItem("user_img") || null }, ...prevData.members]
        }));
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/?email=${userEmail}`);
            console.log("🔥 來自 API 的用戶資訊:", response.data);

            if (response.data.id && response.data.name) {
                setProjectData(prevData => ({
                    ...prevData,
                    members: [{ id: response.data.id, name: response.data.name ,img: localStorage.getItem("user_img") || null}]
                }));
            } else {
                console.warn("⚠️ API 回傳用戶資訊不完整:", response.data);
            }

        } catch (error) {
            console.error("❌ 無法獲取登入用戶資料:", error);
        }
    };

    // 確保 `useEffect` 內部呼叫
    useEffect(() => {
        fetchUser();
    }, [userEmail]);



    // ✅ **新增成員**
    const handleAddMember = (friend) => {
        setProjectData(prevData => {
            // 確保 `members` 陣列內沒有重複的 `user.id`
            const alreadyExists = prevData.members.some(member => member.id === friend.id,);

            if (alreadyExists) {
                console.warn("⚠️ 該成員已經在 members 陣列內:", friend);
                return prevData; // 不更新狀態
            }

            // **更新 members**
            const updatedMembers = [...prevData.members, {
                id: friend.id,
                name: friend.name,
                img: friend.img || null
            }];


            console.log("🔥 更新後的 members:", updatedMembers);

            return {
                ...prevData,
                members: updatedMembers
            };
        });
    };

    // ✅ **移除成員**
    const handleRemoveMember = (name) => {
        if (name !== "自己") {
            setProjectData({
                ...projectData,
                members: projectData.members.filter((member) => member !== name),
            });
        }
    };

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="0px" width="100%">
            {/* 步驟條 */}
            <Flex width="100%" bg="gray.100" p={2} borderRadius="md" mb={4} justify="center">
                {[1, 2, 3, 4].map((num) => (
                    <Box
                        key={num}
                        flex="1"
                        textAlign="center"
                        p={3}
                        fontWeight="bold"
                        bg={currentStep === num ? "white" : "gray.200"}
                        color={currentStep === num ? "black" : "gray.500"}
                        borderRadius="md"
                        mx={1}
                        cursor="pointer"
                        onClick={() => handleStepClick(num)}
                    >
                        Step {num}
                    </Box>
                ))}
            </Flex>

            <Flex direction="row" gap="24px">
                {/* Step 1: 建立專案 */}
                {currentStep === 1 && (
                    <>
                        <Card my="22px" w="75%" pb="0px" height="600px">
                            <CardHeader p="6px 0px 22px 16px">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    Step 1: 建立專案
                                </Text>
                            </CardHeader>
                            <CardBody p="6px 0px 22px 16px">
                                <VStack spacing={4} align="stretch">
                                    <Box>
                                        <Text fontSize="lg" fontWeight="bold">專案名稱</Text>
                                        <Input
                                            placeholder="命名您的專案"
                                            value={projectData.name}
                                            onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontSize="lg" fontWeight="bold">說明</Text>
                                        <Textarea
                                            placeholder="讓人員了解這個專案"
                                            value={projectData.description}
                                            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                                            minHeight="180px"
                                            resize="vertical"
                                        />
                                    </Box>
                                </VStack>
                                <Flex justifyContent="flex-end" mt={6}>
                                    <Button colorScheme="teal" onClick={() => handleStepClick(2)}>
                                        下一步
                                    </Button>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card my="22px" w="30%" height="auto">
                            <CardBody display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <Image src={BuildProjectImage} alt="建立專案示意圖" maxWidth="100%" borderRadius="lg" />
                            </CardBody>
                        </Card>
                    </>
                )}

                {/* Step 2: 邀請成員 */}
                {currentStep === 2 && (
                    <>
                        <Card my="22px" w="70%" pb="0px" height="600px">
                            <CardHeader p="6px 0px 22px 16px">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    Step 2: 邀請成員
                                </Text>
                            </CardHeader>
                            <CardBody p="6px 0px 22px 16px">
                                <VStack spacing={4} align="stretch">
                                    <Box>
                                        <Text fontWeight="bold">已邀請成員</Text>
                                        <List>
                                            {projectData.members.map((member, index) => (
                                                <ListItem key={index} display="flex" justifyContent="space-between" alignItems="center" p={3} borderRadius="md" bg="gray.100">
                                                    <HStack>
                                                        <Avatar name={member.name || "未知"} src={getAvatarUrl(member.img, member.name)} size="sm" />
                                                        <Text>{member.name || "未知用戶"}</Text>
                                                    </HStack>
                                                    {member !== "自己" && (
                                                        <IconButton icon={<CloseIcon />} size="sm" colorScheme="red" onClick={() => handleRemoveMember(member)} />
                                                    )}
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </VStack>
                                <Flex justifyContent="flex-end" mt={4}>
                                    <Button colorScheme="teal" onClick={onNext}>
                                        確認邀請
                                    </Button>
                                </Flex>
                            </CardBody>
                        </Card>

                        {/* 🆕 好友列表從後端獲取 */}
                        <Card my="22px" w="30%" height="auto">
                            <CardHeader>
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    好友列表
                                </Text>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <Spinner size="xl" />
                                ) : (
                                    <List spacing={3}>
                                        {friendsList.map((friend, index) => (
                                            <ListItem key={index} display="flex" alignItems="center" justifyContent="space-between" p={3} borderRadius="md" bg="gray.100">
                                                <HStack>
                                                    <Avatar name={friend.name} src={getAvatarUrl(friend.img, friend.name)} size="sm" />
                                                    <Text>{friend.name}</Text>
                                                </HStack>
                                                <IconButton
                                                    icon={<AddIcon />}
                                                    size="sm"
                                                    colorScheme="green"
                                                    onClick={() => handleAddMember(friend)}
                                                    isDisabled={projectData.members.some(member => member.id === friend.id)} // ✅ 確保 `id` 來判斷是否已加入
                                                />

                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </CardBody>
                        </Card>
                    </>
                )}
            </Flex>
        </Flex>
    );
}

export default ProjectSelectMembers;
