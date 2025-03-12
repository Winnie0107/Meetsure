import React, { useState } from "react";
import {
    useColorModeValue,
    Box,
    Text,
    Button,
    VStack,
    HStack,
    Icon,
    Flex,
    List,
    ListItem,
    ListIcon,
    Progress,
    Checkbox,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useDisclosure
} from "@chakra-ui/react";
import { MdTaskAlt, MdDashboard } from "react-icons/md";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import "react-datepicker/dist/react-datepicker.css";
import { FaTasks, FaCalendarAlt } from "react-icons/fa"; // 匯入 Icon
import MeetingSchedule from "./MeetingSchedule";
import MilestoneProgress from "./MilestoneProgress";

function ProjectManagement() {
    const textColor = useColorModeValue("gray.700", "white");
    const cardBg = useColorModeValue("white", "gray.800");
    const [tabIndex, setTabIndex] = useState(0); // 控制 Tab 切換

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} mx="auto">
            {/* 外部大框架 */}
            <Card w="100%" bg="#F9FAFC" boxShadow="lg" height="780px">
                {/* Tabs (頁籤功能) */}
                <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} variant="soft-rounded" colorScheme="teal">
                    <TabList pl="4">
                        <Tab><MdDashboard size={27} /></Tab>
                        <Tab><FaTasks size={24} /></Tab>
                        <Tab><FaCalendarAlt size={24} /></Tab>
                    </TabList>
                    <TabPanels>
                        {/* 🚀 專案概覽頁面 */}
                        <TabPanel>
                            <CardHeader pb="4">
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="28px" fontWeight="bold" color={textColor}>
                                        Project / 輔仁大學第四十二屆專題-會議MeetSure
                                    </Text>
                                    <Button colorScheme="teal">編輯專案</Button>
                                </Flex>
                            </CardHeader>
                            <Box>
                                <Text fontSize="md" color="gray.600">
                                    此專案為輔仁大學第四十二屆專題，系統核心是 speech-to-text 技術在會議管理上的應用。
                                </Text>
                            </Box>
                            {/* 🔹 主要區塊 */}
                            <HStack align="start" spacing="6" mt="6">
                                {/* 📅 會議排程 (共用元件) */}
                                <MeetingSchedule setTabIndex={setTabIndex} />

                                {/* 📌 中間 */}
                                <MilestoneProgress /> {/* 確保這裡沒有拼寫錯誤 */}

                                {/* 📌 右側 - MY MEETINGS */}
                                <Card flex="1" p="6" bg={cardBg} boxShadow="lg" height="550px">
                                    <Text fontSize="lg" fontWeight="bold">代辦事項</Text>
                                    <Divider my="2" />
                                    <Box>
                                        {/* 這裡未來可以放會議列表 */}
                                    </Box>
                                </Card>
                            </HStack>
                        </TabPanel>

                        {/* ✅ 任務管理頁面 */}
                        <TabPanel>
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

                            {/* 待辦事項 */}
                            <Card flex="1" p="6" bg={cardBg} boxShadow="lg" mt="6">
                                <CardHeader pb="4">
                                    <Text fontSize="xl" fontWeight="bold">待辦事項</Text>
                                </CardHeader>
                                <VStack align="start">
                                    <Checkbox colorScheme="teal">調整登入流程</Checkbox>
                                    <Checkbox colorScheme="teal">修復通知功能</Checkbox>
                                    <Checkbox colorScheme="teal">優化前端 UI</Checkbox>
                                </VStack>
                            </Card>
                        </TabPanel>

                        {/* 📅 會議紀錄頁面 */}
                        <TabPanel>
                            <HStack spacing="6" mt="6" align="stretch">
                                {/* 📅 會議排程 (共用元件) */}
                                <MeetingSchedule setTabIndex={setTabIndex} />


                                {/* 📝 會議記錄逐字稿 (Table) */}
                                <Card flex="3" p="6" bg={cardBg} boxShadow="lg" >
                                    <CardHeader pb="4">
                                        <Text fontSize="lg" fontWeight="bold">專案會議記錄</Text>
                                        <Divider my="2" />
                                    </CardHeader>
                                    <Table variant="simple">
                                        {/* 🔹 表頭 */}
                                        <Thead>
                                            <Tr>
                                                <Th fontSize="16px" fontWeight="bold">會議時間</Th>
                                                <Th fontSize="16px" fontWeight="bold">會議名稱</Th>
                                                <Th fontSize="16px" fontWeight="bold">逐字稿與分析結果</Th>
                                                <Th fontSize="16px" fontWeight="bold">相關連結</Th>
                                                <Th fontSize="16px" fontWeight="bold">編輯</Th>
                                            </Tr>
                                        </Thead>
                                        {/* 📌 表格內容 (假資料) */}
                                        <Tbody>
                                            <Tr>
                                                <Td>2025/02/28 14:00</Td>
                                                <Td>產品討論會</Td>
                                                <Td>
                                                    <Button size="sm" colorScheme="blue">查看</Button>
                                                </Td>
                                                <Td>
                                                    <Button size="sm" colorScheme="blue">查看</Button>
                                                </Td>
                                            </Tr>
                                            <Tr>
                                                <Td>2025/03/01 10:00</Td>
                                                <Td>開發進度報告</Td>
                                                <Td>
                                                    <Button size="sm" colorScheme="blue">查看</Button>
                                                </Td>
                                                <Td>
                                                    <Button size="sm" colorScheme="blue">查看</Button>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </Card>
                            </HStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>
        </Flex>
    );
}

export default ProjectManagement;