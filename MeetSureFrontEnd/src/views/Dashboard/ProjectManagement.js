import React from "react";
import {
    useColorModeValue,
    Box,
    Text,
    Button,
    VStack,
    HStack,
    Icon,
    Flex,
    Avatar,
    List,
    ListItem,
    ListIcon,
    Progress,
    Checkbox,
    Divider
} from "@chakra-ui/react";
import { MdNotificationsActive, MdTaskAlt, MdAttachFile, MdEvent, MdWork } from "react-icons/md";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";

function ProjectManagement() {
    const textColor = useColorModeValue("gray.700", "white");
    const cardBg = useColorModeValue("white", "gray.800");

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} mx="auto">
            {/* 專案名稱與說明 */}
            <Card w="100%" p="6" bg={cardBg} boxShadow="lg">
                <CardHeader pb="4">
                    <Flex justify="space-between" align="center">
                        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                            Project：輔仁大學第四十二屆專題 - 會議MeetSure
                        </Text>
                        <Button colorScheme="teal">編輯專案</Button>
                    </Flex>
                </CardHeader>
                <Box>
                    <Text fontSize="md" color="gray.600">
                        這是專案的詳細說明，描述專案的目標、範圍及成員的角色...
                    </Text>
                </Box>
            </Card>

            {/* 主要資訊區塊 */}
            <HStack spacing="6" mt="6" align="stretch">
                {/* 進行中的任務 */}
                <Card flex="2" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">進行中的任務</Text>
                    </CardHeader>
                    <List spacing={3}>
                        <ListItem><ListIcon as={MdTaskAlt} color="green.500" /> 任務 1：修正 API 錯誤</ListItem>
                        <ListItem><ListIcon as={MdTaskAlt} color="green.500" /> 任務 2：更新 UI 設計</ListItem>
                    </List>
                </Card>

                {/* 進度追蹤 */}
                <Card flex="1" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">進度追蹤</Text>
                    </CardHeader>
                    <Text fontSize="md" color="gray.600">當前進度：75%</Text>
                    <Progress value={75} size="lg" colorScheme="green" mt="2" />
                </Card>
            </HStack>

            {/* 會議 & 檔案 */}
            <HStack spacing="6" mt="6" align="stretch">
                {/* 會議時程 */}
                <Card flex="2" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">會議時程</Text>
                    </CardHeader>
                    <List spacing={3}>
                        <ListItem><ListIcon as={MdEvent} color="purple.500" /> 2025/02/28 14:00 - 產品討論會</ListItem>
                        <ListItem><ListIcon as={MdEvent} color="purple.500" /> 2025/03/01 10:00 - 開發進度報告</ListItem>
                    </List>
                </Card>

                {/* 檔案區 */}
                <Card flex="1" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">檔案區</Text>
                    </CardHeader>
                    <List spacing={3}>
                        <ListItem><ListIcon as={MdAttachFile} color="blue.500" /> 需求文件.pdf</ListItem>
                        <ListItem><ListIcon as={MdAttachFile} color="blue.500" /> 設計稿.png</ListItem>
                    </List>
                </Card>
            </HStack>

            {/* 待辦事項、工時紀錄、專案組員 */}
            <HStack spacing="6" mt="6" align="stretch">
                {/* 專案組員 */}
                <Card flex="1" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">專案組員</Text>
                    </CardHeader>
                    <VStack spacing="3" align="stretch">
                        <HStack><Avatar name="Alice" /><Text>Alice - 前端工程師</Text></HStack>
                        <HStack><Avatar name="Bob" /><Text>Bob - 後端工程師</Text></HStack>
                        <HStack><Avatar name="Charlie" /><Text>Charlie - 設計師</Text></HStack>
                    </VStack>
                </Card>
                {/* 待辦事項 */}
                <Card flex="1" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">待辦事項</Text>
                    </CardHeader>
                    <VStack align="start">
                        <Checkbox colorScheme="teal">調整登入流程</Checkbox>
                        <Checkbox colorScheme="teal">修復通知功能</Checkbox>
                        <Checkbox colorScheme="teal">優化前端 UI</Checkbox>
                    </VStack>
                </Card>

                {/* 工時紀錄 */}
                <Card flex="1" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">工時紀錄</Text>
                    </CardHeader>
                    <VStack spacing="3" align="stretch">
                        <HStack><Avatar name="Alice" /><Text>Alice - 15小時</Text></HStack>
                        <HStack><Avatar name="Charlie" /><Text>Charlie - 12小時</Text></HStack>
                    </VStack>
                </Card>
            </HStack>


            {/* 會議逐字稿 & 最新提醒 */}
            <HStack spacing="6" mt="6" align="stretch">
                <Card flex="1" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">會議逐字稿</Text>
                    </CardHeader>
                    <Box>
                        <Text fontSize="md" color="gray.600">
                            點擊查看最近的會議逐字稿...
                        </Text>
                    </Box>
                </Card>

                <Card flex="1" p="6" bg={cardBg} boxShadow="lg">
                    <CardHeader pb="4">
                        <Text fontSize="xl" fontWeight="bold">最新提醒</Text>
                    </CardHeader>
                    <List spacing={3}>
                        <ListItem><ListIcon as={MdNotificationsActive} color="red.500" /> 需求文件需要審核</ListItem>
                        <ListItem><ListIcon as={MdNotificationsActive} color="red.500" /> 會議時間已變更</ListItem>
                    </List>
                </Card>
            </HStack>
        </Flex>
    );
}

export default ProjectManagement;
