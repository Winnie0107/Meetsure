import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box, Text, List, ListItem, Spinner } from "@chakra-ui/react";
import moment from "moment-timezone"; // 引入 moment-timezone
import axios from "axios";

const RightPanelWithCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);

    // 格式化日期為 yyyy-MM-dd
    const formatDate = (date) => moment(date).tz("Asia/Taipei").format("YYYY-MM-DD");

    // 從 API 獲取資料
    useEffect(() => {
        const fetchMeetings = async () => {
            setLoading(true);
            const formattedDate = formatDate(selectedDate);
            try {
                const userId = localStorage.getItem("user_id"); // 從 localStorage 拿 user_id
                const response = await axios.get("http://127.0.0.1:8000/api/meetings", {
                    params: {
                        date: formattedDate,
                        user_id: userId
                    }
                });

                const meetings = response.data.meetings.map((meeting) => ({
                    ...meeting,
                    localTime: moment.utc(meeting.datetime) // 假設 API 返回 UTC 格式
                        .tz("Asia/Taipei")
                        .format("YYYY-MM-DD HH:mm:ss"),
                }));

                // 按時間升序排列
                meetings.sort((a, b) => {
                    const timeA = moment(a.localTime, "YYYY-MM-DD HH:mm:ss").toDate();
                    const timeB = moment(b.localTime, "YYYY-MM-DD HH:mm:ss").toDate();
                    return timeA - timeB;
                });

                setMeetings(meetings);
            } catch (error) {
                console.error("Error fetching meetings:", error);
                setMeetings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, [selectedDate]);

    return (
        <Box
            border="1px solid lightgray"
            borderRadius="15px"
            h="100%"
            p="20px"
            bg="linear-gradient(to bottom, rgba(255, 255, 255, 0.8),rgba(120, 220, 230, 1))"
        >
            {/* 日曆 */}
            <Calendar
                onChange={(date) => setSelectedDate(moment(date).tz("Asia/Taipei").toDate())}
                value={selectedDate}
            />

            {/* 開會時間列表 */}
            <Text mt="20px" fontWeight="bold" fontSize="lg" color="gray.700" align="center">
                Meetings on {selectedDate.toDateString()}
            </Text>

            {loading ? (
                <Spinner mt="10px" />
            ) : (
                <List spacing={3} mt="10px">
                    {meetings.length > 0 ? (
                        meetings.map((meeting, index) => (
                            <ListItem key={index}>
                                {/* 每個會議項目設置背景 */}
                                <Box
                                    bg="rgba(255, 255, 255, 0.8)" // 白色背景，透明度70%
                                    borderRadius="10px" // 方形圓角
                                    px="25px" // 左右內邊距 10px
                                    py="10px" // 上下內邊距 8px
                                    textAlign="left" // 文字置中
                                >
                                    <Text fontSize="md" color="black" fontWeight="bold">
                                        {moment(meeting.localTime, "YYYY-MM-DD HH:mm:ss").format("HH:mm")} - {meeting.name}
                                    </Text>

                                </Box>
                            </ListItem>
                        ))
                    ) : (
                        <Text color="gray.500">No meetings scheduled</Text>
                    )}
                </List>
            )}
        </Box>
    );
};

export default RightPanelWithCalendar;
