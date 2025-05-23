import React, { useState, useEffect } from "react";
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
    useDisclosure,
    Tooltip,
    IconButton,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import "react-datepicker/dist/react-datepicker.css";
import { FaTasks, FaCalendarAlt, FaUsers, FaFileAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import MeetingSchedule from "./MeetingSchedule";
import MilestoneProgress from "./MilestoneProgress";
import ToDoList from "./ToDoList";
import GanttChart from "./GanttChart";
import MeetingDataList from "./MeetingDataList";
import { useParams } from "react-router-dom";
import axios from "axios"; // 🆕 引入 axios
import ProjectTeamMember from "./ProjectTeamMember";
import { QuestionIcon } from "@chakra-ui/icons";
import ProjectHelpModal from "./ProjectHelpModal";

function ProjectManagement() {
    const textColor = useColorModeValue("gray.700", "white");
    const [tabIndex, setTabIndex] = useState(0);
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [meetings, setMeetings] = useState([]);
    const [tasks, setTasks] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        console.log("目前進入的專案 ID 是：", id);
    }, [id]);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("❌ 找不到 token，請重新登入");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                console.log("🔥 API 回應:", response.data);
                setProject(response.data);
            } catch (error) {
                console.error("❌ 專案資料抓取失敗:", error.response?.data || error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);
    

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} mx="auto">
            <Card
                w="100%"
                bg="#F9FAFC"
                boxShadow="lg"
                minHeight="780px"
                height="auto"
                position="relative" // ✅ 讓右上角 icon 可以定位
            >
                {/* 👉 使用指南問號 icon 吸附在右上角 */}
                <Tooltip label="使用指南" hasArrow placement="left">
                    <IconButton
                        icon={<QuestionIcon />}
                        variant="ghost"
                        colorScheme="teal"
                        aria-label="幫助"
                        onClick={onOpen}
                        position="absolute"
                        top="4"
                        right="4"
                        zIndex="10"
                    />
                </Tooltip>

                <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} variant="soft-rounded" colorScheme="teal">
                    <TabList pl="4">
                        <Tab><MdDashboard size={27} /></Tab>
                        <Tab><FaCalendarAlt size={22} /></Tab>
                        <Tab><FaTasks size={24} /></Tab>
                        <Tab><FaUsers size={26} /></Tab>
                        <Tab><FaFileAlt size={22} /></Tab>

                    </TabList>

                    <TabPanels>
                        {/* 🚀 專案概覽 */}
                        <TabPanel>
                            <CardHeader pb="4" pl="2">
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="28px" fontWeight="bold" color={textColor}>
                                        Project / {loading ? "載入中..." : project?.name || "未命名專案"}
                                    </Text>
                                    <Button colorScheme="teal">編輯專案</Button>
                                </Flex>
                            </CardHeader>
                            <Box pl="2">
                                <Text fontSize="md" color="gray.600">
                                    {loading ? "正在載入專案說明..." : project?.description || "無描述"}
                                </Text>
                            </Box>
                            <HStack align="start" spacing="6" mt="6">
                                <MeetingSchedule
                                    setTabIndex={setTabIndex}
                                    limitMeetings={true}
                                    meetings={meetings}
                                    setMeetings={setMeetings}
                                />
                                <MilestoneProgress />
                                <ToDoList
                                    projectId={id}
                                    setTabIndex={setTabIndex}
                                    limit={true}
                                    tasks={tasks}
                                    setTasks={setTasks}
                                />
                            </HStack>
                        </TabPanel>

                        {/* 📅 會議紀錄 */}
                        <TabPanel>
                            <HStack spacing="6" mt="6" align="stretch">
                                <MeetingSchedule
                                    setTabIndex={setTabIndex}
                                    limitMeetings={false}
                                    meetings={meetings}
                                    setMeetings={setMeetings}
                                />
                                <MeetingDataList projectId={id} />
                            </HStack>
                        </TabPanel>

                        {/* ✅ 任務管理 */}
                        <TabPanel>
                            <HStack spacing="6" mt="6" align="stretch">
                                <Box flex="3" maxW="25%" minW="250px">
                                    <ToDoList
                                        projectId={id}
                                        limit={false}
                                        tasks={tasks}
                                        setTasks={setTasks}
                                    />
                                </Box>
                                <Box flex="7" maxW="75%" overflow="hidden" >
                                    <GanttChart />
                                </Box>
                            </HStack>
                        </TabPanel>


                        {/* 🚀 組員管理頁面 */}
                        <TabPanel>
                            <HStack spacing="6" mt="6" align="start">
                                <Box flex="1">
                                    <ProjectTeamMember />
                                </Box>
                            </HStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>

            {/* 👉 Modal 放這裡 */}
            <ProjectHelpModal isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
}

export default ProjectManagement;
