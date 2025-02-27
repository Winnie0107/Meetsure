import React, { useState } from "react";
import { useColorModeValue, Box, Text, Button, Flex } from "@chakra-ui/react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTasks, FaCheckCircle, FaUsers, FaPlus } from "react-icons/fa";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { Link } from "react-router-dom";


function ProjectTimeline({ onStart }) {
    const textColor = useColorModeValue("gray.700", "white");

    // 定義專案階段
    const tasks = [
        { name: "確認人員", time: "2024-12-01", category: "專案事前準備", icon: <FaTasks /> },
        { name: "建立目標", time: "2024-12-05", category: "專案事前準備", icon: <FaTasks /> },
        { name: "專案初版計畫書", time: "2024-12-05", category: "專案事前準備", icon: <FaTasks /> },
        { name: "繳交進度文件", time: "2024-12-10", category: "專案進行中", icon: <FaUsers /> },
        { name: "系統測試", time: "2024-12-20", category: "專案進行中", icon: <FaUsers /> },
        { name: "專案摘要與總體分析報告", time: "2024-12-20", category: "專案完成後", icon: <FaCheckCircle /> },
        { name: "AI支援建議", time: "2024-12-20", category: "專案完成後", icon: <FaCheckCircle /> },
    ];

    // 顏色對應不同類別
    const categoryColors = {
        "專案事前準備": "#48B2DE",  // 淺藍但不會過亮
        "專案進行中": "#E57872",   // 柔和的金黃色
        "專案完成後": "#47B0AA"    // 清新的綠色
    };

    const [meetings, setMeetings] = useState([]);

    // 新增會議
    const addMeeting = () => {
        const name = prompt("請輸入會議名稱：");
        if (!name) return; // 若取消輸入則不添加

        const time = prompt("請輸入會議時間 (YYYY-MM-DD)：");
        if (!time) return;

        setMeetings([...meetings, { name, time }]);
    };

    const [projectStep, setProjectStep] = useState(4);

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
                        bg={projectStep === num ? "white" : "gray.200"}
                        color={projectStep === num ? "black" : "gray.500"}
                        borderRadius="md"
                        transition="0.3s"
                        mx={1} // 讓步驟之間有一點間隔
                    >
                        Step {num}
                    </Box>
                ))}
            </Flex>

            {/* 主要內容區域，包含兩個 Card */}
            <Flex direction="row" gap="24px">
                {/* 左側 - 專案進度 */}
                <Box w="60%">
                    <Card my="22px" w="100%" pb="10px" height="auto">
                        <CardHeader p="6px 0px 22px 16px">
                            <Flex justify="space-between" alignItems="center">
                                <Text fontSize="2xl" color={textColor} fontWeight="bold">
                                    Step.4 設定專案進度
                                </Text>
                                {/* 開始按鈕 */}
                                <Box mt="4" display="flex" justifyContent="center">
                                    <Link to="/admin/projectmanagement">
                                        <Button colorScheme="teal">開始管理專案</Button>
                                    </Link>
                                </Box>
                            </Flex>
                        </CardHeader>

                        <CardHeader p="16px 0px 0px 16px" textAlign="center">
                            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                專案進度條
                            </Text>
                        </CardHeader>
                        {/* 時間軸 - 專案進度 */}
                        <Box
                            sx={{
                                ".vertical-timeline": {
                                    maxWidth: "100%",
                                    margin: "0 auto",
                                },
                                ".vertical-timeline::before": {
                                    backgroundColor: "lightgrey !important",
                                    width: "5px !important",
                                },
                                ".vertical-timeline-element": {
                                    margin: "10px 0 !important",
                                    padding: "5px !important",
                                },
                                ".vertical-timeline-element-content": {
                                    paddingLeft: "20px !important",
                                    paddingTop: "3px !important",
                                    paddingBottom: "10px !important",
                                    maxHeight: "150px !important",
                                },
                                ".timeline-date": {
                                    color: "black !important",
                                    fontWeight: "bold",
                                    paddingLeft: "25px",
                                    paddingRight: "25px",
                                    marginTop: "0px !important",
                                },
                            }}
                        >
                            <VerticalTimeline className="vertical-timeline">
                                {tasks.map((task, index) => {
                                    const [selectedDate, setSelectedDate] = useState(null);
                                    const isLeft = index % 2 !== 0; // 偶數靠左，奇數靠右

                                    return (
                                        <VerticalTimelineElement
                                            key={index}
                                            className="vertical-timeline-element--work"
                                            contentStyle={{
                                                background: categoryColors[task.category],
                                                color: "#fff",
                                            }}
                                            contentArrowStyle={{ borderRight: `10px solid ${categoryColors[task.category]}` }}
                                            date={
                                                <Box
                                                    display="flex"
                                                    justifyContent={isLeft ? "flex-end" : "flex-start"} // 左邊靠右，右邊靠左
                                                    textAlign={isLeft ? "right" : "left"}
                                                    minWidth="100px"
                                                    mr={isLeft ? "15px" : "0"} // 左側元素右邊留 10px
                                                    ml={isLeft ? "0" : "15px"} // 右側元素左邊留 10px
                                                >
                                                    {selectedDate ? (
                                                        <Text
                                                            className="timeline-date"
                                                            cursor="pointer"
                                                            _hover={{ textDecoration: "underline", color: "blue" }}
                                                            onClick={() => {
                                                                const newDate = prompt("請輸入日期 (YYYY-MM-DD)：", selectedDate);
                                                                if (newDate) setSelectedDate(newDate);
                                                            }}
                                                        >
                                                            {selectedDate}
                                                        </Text>
                                                    ) : (
                                                        <FaPlus
                                                            cursor="pointer"
                                                            size="18px"
                                                            color="gray"
                                                            onClick={() => {
                                                                const newDate = prompt("請輸入日期 (YYYY-MM-DD)：", task.time);
                                                                if (newDate) setSelectedDate(newDate);
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            dateClassName="timeline-date"
                                            iconStyle={{ background: categoryColors[task.category], color: "#fff" }}
                                            icon={task.icon}
                                        >
                                            <Text sx={{ fontSize: "18px !important", fontWeight: "bold !important" }}>
                                                {task.name}
                                            </Text>
                                            <Text fontSize="sm">Step: {task.category}</Text>
                                        </VerticalTimelineElement>
                                    );
                                })}

                            </VerticalTimeline>
                        </Box>
                    </Card>
                </Box>

                {/* 右側 - 會議時間表 */}
                <Box w="40%">
                    <Card my="22px" w="100%" pb="30px" height="auto">
                        <CardHeader p="100px 0px 22px 16px" textAlign="center">
                            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                會議時程安排
                            </Text>
                        </CardHeader>

                        <Box border="1px solid #ddd" borderRadius="lg" p="6" bg="gray.100" textAlign="center">
                            {meetings.length === 0 ? (
                                <Text fontSize="lg" color="gray.500">尚無會議</Text>
                            ) : (
                                meetings.map((meeting, index) => (
                                    <Text key={index} fontSize="lg" mb="2">
                                        📅 {meeting.time} - {meeting.name}
                                    </Text>
                                ))
                            )}
                        </Box>

                        {/* 新增會議按鈕 */}
                        <Box mt="4" display="flex" justifyContent="center">
                            <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={addMeeting}>
                                添加會議
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Flex>
        </Flex>
    );
}

export default ProjectTimeline;
