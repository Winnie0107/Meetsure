import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/CalendarStyles.css"; // ⬅️ 自訂樣式
import {
  Box, Text, List, ListItem, Spinner, Flex,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, FormControl, FormLabel, Input,
  Textarea, useDisclosure, useToast,
} from "@chakra-ui/react";
import moment from "moment-timezone";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RightPanelWithCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [allMeetings, setAllMeetings] = useState([]); // ⬅️ 全部會議
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const toast = useToast();

  const formatDate = (date) => moment(date).tz("Asia/Taipei").format("YYYY-MM-DD");

  const fetchMeetings = async () => {
    setLoading(true);
    const formattedDate = formatDate(selectedDate);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/meetings/all_user_meetings/?user_id=${userId}`, {
        headers: { Authorization: `Token ${token}` },
      });

      const all = response.data.meetings || [];
      setAllMeetings(all); // 儲存全部會議

      const filtered = all.filter(
        (m) => moment(m.datetime).tz("Asia/Taipei").format("YYYY-MM-DD") === formattedDate
      );

      filtered.sort((a, b) =>
        moment(a.datetime).tz("Asia/Taipei").toDate() - moment(b.datetime).tz("Asia/Taipei").toDate()
      );

      setMeetings(filtered);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [selectedDate]);

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    onDetailOpen();
  };

  const handleUpdateMeeting = async () => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/meetings/${selectedMeeting.id}/update/`,
        selectedMeeting,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      toast({ title: "已儲存變更", status: "success" });
      onDetailClose();
      fetchMeetings();
    } catch (err) {
      toast({ title: "儲存失敗", status: "error" });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteMeeting = async () => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/meetings/${selectedMeeting.id}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      toast({ title: "已刪除會議", status: "info" });
      onDetailClose();
      fetchMeetings();
    } catch (err) {
      toast({ title: "刪除失敗", status: "error" });
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Box
      border="1px solid #E2E8F0 "
      borderRadius="15px"
      h="100%"
      p="20px"
      bg="#F5F5F5"
    >

      <Calendar
        onChange={(date) => setSelectedDate(moment(date).tz("Asia/Taipei").toDate())}
        value={selectedDate}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const formatted = moment(date).tz("Asia/Taipei").format("YYYY-MM-DD");
            const today = moment().tz("Asia/Taipei").format("YYYY-MM-DD");

            if (formatted === today) return "today-tile";

            const hasMeeting = allMeetings.some(
              (m) => moment(m.datetime).tz("Asia/Taipei").format("YYYY-MM-DD") === formatted
            );
            return hasMeeting ? "has-meeting" : null;
          }
        }}
      />

      <Text mt="20px" fontWeight="bold" fontSize="lg" color="gray.700" align="center">
        Meetings on {selectedDate.toDateString()}
      </Text>

      {loading ? (
        <Spinner mt="10px" />
      ) : (
        <List spacing={3} mt="10px">
          {meetings.length > 0 ? (
            meetings.map((meeting, index) => (
              <ListItem key={index} onClick={() => handleMeetingClick(meeting)} cursor="pointer">
                <Box
                  bg="#D1E4E2" // ✅ 柔綠背景
                  borderRadius="15px"
                  px="25px"
                  py="10px"
                  _hover={{ bg: "#cbe0de" }}
                >

                  <Flex justify="space-between" wrap="wrap">
                    <Text fontSize="md" fontWeight="bold">
                      {moment(meeting.datetime).tz("Asia/Taipei").format("HH:mm")} - {meeting.name}
                    </Text>
                  </Flex>
                  {meeting.project_name && (
                    <Box bg="white" px={2} borderRadius="md" fontSize="14px" mb="2" mt="2">
                      {meeting.project_name}
                    </Box>
                  )}
                  {meeting.location && (
                    <Text fontSize="sm" fontWeight="bold" color="gray.600" mt={1}>{meeting.location}</Text>
                  )}
                </Box>
              </ListItem>
            ))
          ) : (
            <Text color="gray.500">No meetings scheduled</Text>
          )}
        </List>
      )}

      <Modal isOpen={isDetailOpen} onClose={onDetailClose} isCentered>
        <ModalOverlay />
        <ModalContent p={4} borderRadius="25px" minW="600px">
          <ModalHeader>會議資訊</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMeeting && (
              <>
                <FormControl mb={3}>
                  <FormLabel>會議名稱</FormLabel>
                  <Input
                    value={selectedMeeting.name}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, name: e.target.value })}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>會議時間</FormLabel>
                  <DatePicker
                    selected={new Date(selectedMeeting.datetime)}
                    onChange={(date) => setSelectedMeeting({ ...selectedMeeting, datetime: date })}
                    showTimeSelect
                    dateFormat="yyyy/MM/dd HH:mm"
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    customInput={<Input />}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>地點</FormLabel>
                  <Input
                    value={selectedMeeting.location || ""}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, location: e.target.value })}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>詳細資訊</FormLabel>
                  <Textarea
                    value={selectedMeeting.details || ""}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, details: e.target.value })}
                  />
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" variant="outline" mr={3} isLoading={modalLoading} onClick={handleDeleteMeeting}>
              刪除會議
            </Button>
            <Button colorScheme="teal" isLoading={modalLoading} onClick={handleUpdateMeeting}>
              儲存變更
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RightPanelWithCalendar;
