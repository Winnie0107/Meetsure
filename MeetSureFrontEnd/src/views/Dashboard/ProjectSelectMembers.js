import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import BuildProjectImage from "assets/img/buildproject.png"; // 專案建立示意圖

function ProjectSelectMembers({ onNext }) {
    const [members, setMembers] = useState(["自己"]); // 預設包含組長
    const textColor = useColorModeValue("gray.700", "white");
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [step, setStep] = useState(1);

    // 模擬好友列表
    const friendsList = ["Alice", "Bob", "Charlie", "David", "Emma"];

    // 新增成員到邀請列表
    const handleAddMember = (friend) => {
        if (!members.includes(friend)) {
            setMembers([...members, friend]);
        }
    };

    // 移除成員
    const handleRemoveMember = (name) => {
        if (name !== "自己") {
            setMembers(members.filter((member) => member !== name));
        }
    };

    // 切換到下一步
    const handleNextStep = () => {
        if (step === 1) {
            setStep(2);
        } else {
            onNext();
        }
    };

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="0px" width="100%">
            {/* 步驟指示條 */}
            <Flex width="100%" bg="gray.100" p={2} borderRadius="md" mb={4} justify="center">
                {[1, 2, 3, 4].map((num) => (
                    <Box
                        key={num}
                        flex="1"
                        textAlign="center"
                        p={3}
                        fontWeight="bold"
                        bg={step === num ? "white" : "gray.200"}
                        color={step === num ? "black" : "gray.500"}
                        borderRadius="md"
                        transition="0.3s"
                        mx={1}
                    >
                        Step {num}
                    </Box>
                ))}
            </Flex>

            {/* 主要內容區域 */}
            <Flex direction="row" gap="24px">
                {/* Step 1: 建立專案 */}
                {step === 1 && (
                    <>
                        <Card my="22px" w="70%" pb="0px" height="600px">
                            <CardHeader p="6px 0px 22px 16px">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    Step 1: 建立專案
                                </Text>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={4} align="stretch" px="20px">
                                    <Box>
                                        <Text fontSize="lg" fontWeight="bold" mb={2}>
                                            專案名稱
                                        </Text>
                                        <Input
                                            placeholder="命名您的專案"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontSize="lg" fontWeight="bold" mb={2}>
                                            說明
                                        </Text>
                                        <Textarea
                                            placeholder="讓人員了解這個專案"
                                            value={projectDescription}
                                            onChange={(e) => setProjectDescription(e.target.value)}
                                            minHeight="180px"
                                            resize="vertical"
                                        />
                                    </Box>
                                </VStack>
                                {/* 按鈕 - 下一步 */}
                                <Flex justifyContent="flex-end" mt={6} px="20px">
                                    <Button colorScheme="teal" onClick={handleNextStep}>
                                        {step === 1 ? "下一步" : "確認邀請"}
                                    </Button>
                                </Flex>
                            </CardBody>
                        </Card>

                        {/* 右側顯示圖片 */}
                        <Card my="22px" w="30%" height="auto">
                            <CardBody display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <Image src={BuildProjectImage} alt="建立專案示意圖" maxWidth="100%" borderRadius="lg" />
                            </CardBody>
                        </Card>
                    </>
                )}

                {/* Step 2: 邀請成員 */}
                {step === 2 && (
                    <>
                        {/* 左側：邀請名單 */}
                        <Card my="22px" w="70%" pb="0px" height="auto">
                            <CardHeader p="6px 0px 22px 16px">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    Step 2: 邀請成員
                                </Text>
                            </CardHeader>
                            <CardBody height="500px">
                                <VStack spacing={4} align="stretch" px="20px">
                                    {/* 🏆 組長區塊 (單獨顯示，不出現在 members) */}
                                    <Box p={3} bg="blue.100" borderRadius="md">
                                        <HStack>
                                            <Avatar name="自己" size="sm" />
                                            <Text fontWeight="bold">自己 (組長)</Text>
                                        </HStack>
                                    </Box>

                                    {/* 📜 已邀請成員列表 (排除"自己") */}
                                    <List spacing={3}>
                                        {members
                                            .filter((member) => member !== "自己") // 過濾掉 "自己"，避免重複顯示
                                            .map((member, index) => (
                                                <ListItem
                                                    key={index}
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    p={3}
                                                    borderRadius="md"
                                                    bg="gray.100"
                                                >
                                                    <HStack>
                                                        <Avatar name={member} size="sm" />
                                                        <Text>{member}</Text>
                                                    </HStack>
                                                    <IconButton
                                                        icon={<CloseIcon />}
                                                        size="sm"
                                                        colorScheme="red"
                                                        onClick={() => handleRemoveMember(member)}
                                                    />
                                                </ListItem>
                                            ))}
                                    </List>
                                </VStack>
                                {/* 按鈕 - 讓按鈕固定在右下角 */}
                                <Flex justifyContent="flex-end" mt={4} px="20px">
                                    <Button colorScheme="teal" onClick={handleNextStep}>
                                        {step === 1 ? "下一步" : "確認邀請"}
                                    </Button>
                                </Flex>
                            </CardBody>
                        </Card>

                        {/* 右側：好友列表 */}
                        <Card my="22px" w="30%" height="auto">
                            <CardHeader p="6px 0px 22px 16px">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    好友列表
                                </Text>
                            </CardHeader>
                            <CardBody>
                                <List spacing={3}>
                                    {friendsList.map((friend, index) => (
                                        <ListItem
                                            key={index}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            p={3}
                                            borderRadius="md"
                                            bg="gray.100"
                                        >
                                            <HStack>
                                                <Avatar name={friend} size="sm" />
                                                <Text>{friend}</Text>
                                            </HStack>
                                            <IconButton
                                                icon={<AddIcon />}
                                                size="sm"
                                                colorScheme="green"
                                                onClick={() => handleAddMember(friend)}
                                                isDisabled={members.includes(friend)}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardBody>
                        </Card>
                    </>
                )}
            </Flex>
        </Flex>
    );
}

export default ProjectSelectMembers;