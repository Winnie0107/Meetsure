import React, { useState } from "react";
import {
    useColorModeValue,
    Box,
    Text,
    Button,
    HStack,
    Flex,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import "react-datepicker/dist/react-datepicker.css";
import { FaTasks, FaCalendarAlt, FaUsers } from "react-icons/fa"; // 匯入 Icon
import { MdDashboard } from "react-icons/md";
import MeetingSchedule from "./MeetingSchedule";
import MilestoneProgress from "./MilestoneProgress";
import ToDoList from "./ToDoList";
import GanttChart from "./GanttChart";
import MeetingDataList from "./MeetingDataList";

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
                        <Tab><FaCalendarAlt size={22} /></Tab>
                        <Tab><FaTasks size={24} /></Tab>
                        <Tab><FaUsers size={26} /></Tab>
                    </TabList>
                    <TabPanels>
                        {/* 🚀 專案概覽頁面 */}
                        <TabPanel>
                            <CardHeader pb="4" pl="2">
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="28px" fontWeight="bold" color={textColor}>
                                        Project / 輔仁大學第四十二屆專題 - 會議MeetSure
                                    </Text>
                                    <Button colorScheme="teal">編輯專案</Button>
                                </Flex>
                            </CardHeader>
                            <Box pl="2">
                                <Text fontSize="md" color="gray.600">
                                    此專案為輔仁大學第四十二屆專題，系統核心是 speech-to-text 技術在會議管理上的應用。
                                </Text>
                            </Box>
                            {/* 🔹 主要區塊 */}
                            <HStack align="start" spacing="6" mt="6">
                                {/* 📅 會議排程 (共用元件) */}
                                <MeetingSchedule setTabIndex={setTabIndex} />

                                {/* 📌 專案進度追蹤*/}
                                <MilestoneProgress />

                                {/* 📌 代辦事項 (共用元件)*/}
                                <ToDoList />
                            </HStack>
                        </TabPanel>

                        {/* 📅 會議紀錄頁面 */}
                        <TabPanel>
                            <HStack spacing="6" mt="6" align="stretch">
                                {/* 📅 會議排程 (共用元件) */}
                                <MeetingSchedule setTabIndex={setTabIndex} />

                                {/* 📝 會議記錄逐字稿 (Table) */}
                                <MeetingDataList />
                            </HStack>
                        </TabPanel>

                        {/* ✅ 任務管理頁面 */}
                        <TabPanel>
                            <HStack spacing="6" mt="6" align="stretch" width="100%" maxWidth="1200px" mx="auto">
                                {/* 📌 代辦事項(共用元件) */}
                                <Box flex="3" maxW="25%" minW="250px">
                                    <ToDoList />
                                </Box>

                                {/* 📊 甘特圖*/}
                                <Box flex="7" maxW="75%" overflow="hidden">
                                    <GanttChart />
                                </Box>
                            </HStack>
                        </TabPanel>

                        {/* 🚀 組員管理頁面 */}
                        <TabPanel>

                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>
        </Flex>
    );
}

export default ProjectManagement;