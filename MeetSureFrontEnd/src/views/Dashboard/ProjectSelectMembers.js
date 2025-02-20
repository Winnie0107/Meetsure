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
    Image,
    keyframes,
    Textarea,
} from "@chakra-ui/react";
import { CloseIcon, CheckIcon, CopyIcon } from "@chakra-ui/icons"; // 引入CopyIcon
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import BuildProjectImage from "assets/img/buildproject.png";
import { QRCodeCanvas } from 'qrcode.react';

function ProjectSelectMembers({ onNext }) {
    const [memberName, setMemberName] = useState("");
    const [members, setMembers] = useState([]);
    const textColor = useColorModeValue("gray.700", "white");
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [step, setStep] = useState(1);

    const [copied, setCopied] = useState(false); // 記錄是否複製過
    const inviteLink = "https://example.com/invite"; // 模擬邀請連結

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2秒後重置為未複製
        });
    };

    const handleAddMember = () => {
        if (memberName.trim() && !members.includes(memberName)) {
            setMembers([...members, memberName]);
            setMemberName("");
        }
    };

    const handleRemoveMember = (name) => {
        setMembers(members.filter((member) => member !== name));
    };

    const handleNextStep = () => {
        if (step === 1) {
            setStep(2);
        } else {
            onNext();
        }
    };

    const floatAnimation = keyframes`
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
    `;

    return (
        <Flex direction="row" pt={{ base: "120px", md: "75px" }} gap="24px">
            <Card my="22px" w="70%" pb="0px" height="600px">
                <CardHeader p="6px 0px 22px 16px">
                    <Flex justify="space-between" alignItems="center">
                        <Text fontSize="2xl" color={textColor} fontWeight="bold">
                            {step === 1 ? "Step.1 建立專案" : "Step.2 邀請成員"}
                        </Text>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <VStack spacing={6} align="stretch" px="20px">
                        {step === 1 && (
                            <Box>
                                <Text fontSize="lg" fontWeight="bold" mb={2}>
                                    專案名稱
                                </Text>
                                <Input
                                    placeholder="命名您的專案"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    mb="8"
                                />
                                <Text fontSize="lg" fontWeight="bold" mb={2}>
                                    說明
                                </Text>
                                <Textarea
                                    placeholder="讓人員了解這個專案"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    minHeight="120px"
                                    resize="vertical"
                                />
                            </Box>
                        )}

                        {step === 2 && (
                            <Box pt={4}>
                                <Flex gap={2} mb={4}>
                                    <Input
                                        placeholder="輸入組員名稱或電子郵件地址"
                                        value={memberName}
                                        onChange={(e) => setMemberName(e.target.value)}
                                    />
                                    <Button colorScheme="blue" onClick={handleAddMember}>
                                        送出邀請
                                    </Button>
                                </Flex>
                                <List spacing={3}>
                                    {members.map((member, index) => (
                                        <ListItem key={index} display="flex" alignItems="center">
                                            <Text flex="1">{member}</Text>
                                            <IconButton
                                                icon={<CloseIcon />}
                                                size="sm"
                                                colorScheme="red"
                                                onClick={() => handleRemoveMember(member)}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </VStack>
                </CardBody>
                <Button
                    mt={6}
                    colorScheme="teal"
                    isDisabled={step === 1 ? !projectName : members.length === 0}
                    onClick={handleNextStep}
                    width="auto"
                    ml="auto"
                    mr={6}
                >
                    {step === 1 ? "下一步" : "下一步"}
                </Button>
            </Card>

            {step === 1 && (
                <Card my="22px" w="30%" height="600px" border="1px solid" borderColor="gray.200">
                    <CardHeader p="6px 0px 22px 16px"></CardHeader>
                    <CardBody display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Box textAlign="center" mb="8">
                            <Image
                                src={BuildProjectImage}
                                alt="流程圖片"
                                maxWidth="100%"
                                borderRadius="lg"
                                boxSize="100%"
                                animation={`${floatAnimation} 4s ease-in-out infinite`}
                            />
                        </Box>
                    </CardBody>
                </Card>
            )}

            {step === 2 && (
                <Card my="22px" w="30%" height="600px" position="relative">
                    <CardHeader p="6px 0px 22px 16px" mb="8">
                        <Flex justify="space-between" alignItems="center">
                            <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                邀請連結
                            </Text>
                        </Flex>
                    </CardHeader>
                    <CardBody display="flex" flexDirection="column" alignItems="center" gap={4}>
                        <QRCodeCanvas value={inviteLink} size={150} />
                        <Flex width="100%" alignItems="center" mt="4">
                            <Input
                                value={inviteLink}
                                isReadOnly
                                borderRight="none"
                                textAlign="center"
                                mr={2}
                            />
                            <IconButton
                                icon={copied ? <CheckIcon /> : <CopyIcon />}
                                size="lg"
                                colorScheme="gray"
                                backgroundColor="gray.200"
                                _hover={{ backgroundColor: "gray.300" }}
                                height="100%" // 讓按鈕高度和Input相同
                                onClick={handleCopy}
                            />
                        </Flex>
                    </CardBody>
                </Card>
            )}
        </Flex>
    );
}

export default ProjectSelectMembers;
