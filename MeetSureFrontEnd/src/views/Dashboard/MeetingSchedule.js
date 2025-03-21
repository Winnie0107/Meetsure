import React, { useState, useEffect } from "react";
import {
    Flex, Box, Icon, VStack, HStack, Text, Divider, Button, Modal, ModalOverlay, ModalContent, Textarea,
    ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Input, useDisclosure, FormControl, FormLabel
} from "@chakra-ui/react";
import { MdAdd, MdEvent } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";

const MeetingSchedule = ({ setTabIndex }) => {
    const { id: projectId } = useParams();   // 從 URL 取得專案 ID
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [meetingDate, setMeetingDate] = useState(new Date());
    const [meetings, setMeetings] = useState([]);
    const [newMeeting, setNewMeeting] = useState({
        name: "",
        location: "",
        details: ""
    });
    const userId = localStorage.getItem("user_id");
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();


    // 🚀 **取得會議列表**
    useEffect(() => {
        console.log("目前登入用戶 ID：", localStorage.getItem("user_id"));

        const fetchMeetings = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/meetings/${projectId}/`);
                console.log("🔥 取得的會議列表:", response.data);
                setMeetings(response.data);
            } catch (error) {
                console.error("❌ 無法獲取會議列表:", error);
            }
        };
        fetchMeetings();
    }, [projectId]);

    // 🚀 **處理會議表單變更**
    const handleChange = (e) => {
        setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
    };

    // 🚀 **提交新增會議**
    const handleCreateMeeting = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/meetings/create/", {
                project: projectId,
                name: newMeeting.name,
                datetime: meetingDate,
                location: newMeeting.location,
                details: newMeeting.details,
                created_by: userId, // ✅ 使用登入者 ID
            });

            console.log("✅ 會議創建成功:", response.data);
            setMeetings([...meetings, response.data]);
            onClose(); // 關閉 Modal
        } catch (error) {
            console.error("❌ 無法創建會議:", error);
        }
    };

    // 🚀 **更新會議細節**
    const handleUpdateMeeting = async () => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/meetings/${selectedMeeting.id}/update/`,
                selectedMeeting
            );
            setMeetings(meetings.map(m => (m.id === selectedMeeting.id ? response.data : m)));
            onDetailClose();
        } catch (error) {
            console.error("❌ 會議更新失敗:", error);
        }
    };

    // 🚀 **刪會議**
    const handleDeleteMeeting = async () => {
        if (!selectedMeeting) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/meetings/${selectedMeeting.id}/delete/`);
            setMeetings(meetings.filter(m => m.id !== selectedMeeting.id));
            onDetailClose(); // 關閉 Modal
        } catch (error) {
            console.error("❌ 無法刪除會議:", error);
        }
    };


    return (
        <Card flex="1" p="6" bg="white" boxShadow="lg" height="535px">
            <CardHeader pb="4">
                <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">會議排程</Text>
                    <Icon as={MdEvent} boxSize={5} color="gray.500" />
                </Flex>
                <Divider my="2" />
                <Text fontSize="sm" color="gray.500"> 點擊會議查看詳細資訊或修改</Text>
            </CardHeader>

            <VStack spacing={4} align="stretch">
                {/* 📅 新增會議 */}
                <Box p="8" bg="gray.100" borderRadius="lg" boxShadow="md" textAlign="center" cursor="pointer" onClick={onOpen}>
                    <Icon as={MdAdd} boxSize={6} color="gray.600" />
                </Box>

                {/* 📅 Modal - 新增會議 */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent p={4} borderRadius="25px" minW="600px">
                        <ModalHeader>新增會議</ModalHeader>
                        <ModalCloseButton mt="4" />
                        <ModalBody>
                            <FormControl mb={3}>
                                <FormLabel>會議名稱</FormLabel>
                                <Input name="name" value={newMeeting.name} onChange={handleChange} placeholder="輸入會議名稱..." />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>選擇會議時間</FormLabel>
                                <DatePicker
                                    selected={meetingDate}
                                    onChange={(date) => setMeetingDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy/MM/dd HH:mm"
                                    customInput={<Input />}
                                />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>會議地點</FormLabel>
                                <Input name="location" value={newMeeting.location} onChange={handleChange} placeholder="輸入會議地點..." />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>會議連結或其他資訊</FormLabel>
                                <Textarea name="details" value={newMeeting.details} onChange={handleChange} placeholder="輸入您的資訊..." minHeight="110px" resize="vertical" />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="gray" mr={3} onClick={onClose}>取消</Button>
                            <Button colorScheme="teal" onClick={handleCreateMeeting}>確認新增</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* 會議列表 */}
                {meetings.map(meeting => (
                    <Box
                        key={meeting.id}
                        p="6"
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        cursor="pointer"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            bg: "gray.50",
                            transform: "scale(1.02)",
                            boxShadow: "lg",
                        }}
                        onClick={() => {
                            setSelectedMeeting(meeting);
                            onDetailOpen();
                        }}
                    >
                        <HStack justify="space-between">
                            <Box>
                                <Text fontSize="sm" color="gray.500">New Meetings</Text>
                                <Text fontSize="lg" fontWeight="bold">{meeting.name}</Text>
                            </Box>
                            <Icon as={MdEvent} color="blue.500" boxSize={5} />
                        </HStack>
                        <HStack justify="space-between" mt={2}>
                            <Text fontSize="sm" fontWeight="bold">
                                {new Date(meeting.datetime).toLocaleString("zh-TW", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">{meeting.location || "未填寫"}</Text>
                        </HStack>
                    </Box>
                ))}

                {/* ＃更新會議 */}
                <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
                    <ModalOverlay />
                    <ModalContent p={4} borderRadius="25px" minW="600px">
                        <ModalHeader>會議資訊</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {selectedMeeting && (
                                <>
                                    <FormControl mb={3}>
                                        <FormLabel>會議名稱</FormLabel>
                                        <Input value={selectedMeeting.name} onChange={(e) => setSelectedMeeting({ ...selectedMeeting, name: e.target.value })} />
                                    </FormControl>
                                    <FormControl mb={3}>
                                        <FormLabel>會議時間</FormLabel>
                                        <DatePicker selected={new Date(selectedMeeting.datetime)} onChange={(date) => setSelectedMeeting({ ...selectedMeeting, datetime: date })} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="yyyy/MM/dd HH:mm" customInput={<Input />} />
                                    </FormControl>
                                    <FormControl mb={3}>
                                        <FormLabel>地點</FormLabel>
                                        <Input value={selectedMeeting.location} onChange={(e) => setSelectedMeeting({ ...selectedMeeting, location: e.target.value })} />
                                    </FormControl>
                                    <FormControl mb={3}>
                                        <FormLabel>詳細資訊</FormLabel>
                                        <Textarea value={selectedMeeting.details} onChange={(e) => setSelectedMeeting({ ...selectedMeeting, details: e.target.value })} />
                                    </FormControl>
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="red" variant="outline" mr={3} onClick={handleDeleteMeeting}>
                                刪除會議
                            </Button>
                            <Button colorScheme="teal" onClick={handleUpdateMeeting}>儲存變更</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </VStack>
        </Card>
    );
};

export default MeetingSchedule;
