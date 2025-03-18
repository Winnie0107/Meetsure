import React, { useState } from "react";
import {
    Flex, Box, Icon, VStack, HStack, Text, Divider, Button, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Input, useDisclosure, FormControl, FormLabel
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { MdAdd, MdEvent } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MeetingSchedule = ({ setTabIndex }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [meetingDate, setMeetingDate] = useState(new Date());

    return (
        <Card flex="1" p="6" bg="white" boxShadow="lg" height="535px">
            <CardHeader pb="4">
                <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">會議排程</Text>
                    <Icon as={MdEvent} boxSize={5} color="gray.500" />
                </Flex>
                <Divider my="2" />
            </CardHeader>

            <VStack spacing={4} align="stretch">
                {/* 📅 新增會議 - 加號按鈕 */}
                <Box
                    p="8"
                    bg="gray.100"
                    borderRadius="lg"
                    boxShadow="md"
                    textAlign="center"
                    cursor="pointer"
                    onClick={onOpen}
                >
                    <Icon as={MdAdd} boxSize={6} color="gray.600" />
                </Box>

                {/* 📅 Modal - 新增會議 */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>新增會議</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl mb={3}>
                                <FormLabel>會議名稱</FormLabel>
                                <Input placeholder="輸入會議名稱..." />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>會議地點</FormLabel>
                                <Input placeholder="輸入會議地點..." />
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
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="gray" mr={3} onClick={onClose}>
                                取消
                            </Button>
                            <Button colorScheme="teal">確認新增</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* 📅 會議 1 */}
                <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
                    <HStack justify="space-between">
                        <Box>
                            <Text fontSize="sm" color="gray.500">New Meetings</Text>
                            <Text fontSize="lg" fontWeight="bold">專題進度確認</Text>
                        </Box>
                        <Icon as={MdEvent} color="blue.500" boxSize={5} />
                    </HStack>
                    <HStack justify="space-between" mt={2}>
                        <Text fontSize="sm" fontWeight="bold">2025/03/10 12:15 PM</Text>
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">Meet</Text>
                    </HStack>
                </Box>

                {/* 📅 會議 2 */}
                <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
                    <HStack justify="space-between">
                        <Box>
                            <Text fontSize="sm" color="gray.500">New Meetings</Text>
                            <Text fontSize="lg" fontWeight="bold">後端開發討論</Text>
                        </Box>
                        <Icon as={MdEvent} color="blue.500" boxSize={5} />
                    </HStack>
                    <HStack justify="space-between" mt={2}>
                        <Text fontSize="sm" fontWeight="bold">2025/03/12 3:45 PM</Text>
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">LINE</Text>
                    </HStack>
                </Box>
            </VStack>

            {/* 查看所有會議 - 點擊切換到 "會議紀錄" */}
            <Flex justify="flex-end" mt={6}>
                <Text
                    fontSize="14px"
                    color="blue.500"
                    fontWeight="bold"
                    cursor="pointer"
                    onClick={() => setTabIndex(2)}
                >
                    查看所有會議 →
                </Text>
            </Flex>
        </Card>
    );
};

export default MeetingSchedule;
