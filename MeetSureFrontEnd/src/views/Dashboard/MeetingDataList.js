import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Text,
    Divider,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import MeetSure from "./MeetSure";

const MeetingDataList = ({ projectId }) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose
    } = useDisclosure();
    const {
        isOpen: isNoteOpen,
        onOpen: onNoteOpen,
        onClose: onNoteClose
    } = useDisclosure();

    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [selectedNoteRecord, setSelectedNoteRecord] = useState(null);

    useEffect(() => {
        if (projectId) {
            axios.get(`http://127.0.0.1:8000/api/meeting-records/${projectId}/`)
                .then(res => {
                    setRecords(res.data);
                })
                .catch(err => {
                    console.error("❌ 會議紀錄讀取失敗：", err);
                });
        }
    }, [projectId]);

    return (
        <Card flex="3" p="6" bg={cardBg} boxShadow="lg">
            <CardHeader pb="4" display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold">專案會議記錄</Text>
                <Button size="md" colorScheme="gray" onClick={onOpen}>
                    上傳會議紀錄
                </Button>
            </CardHeader>
            <Divider my="2" />

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th fontSize="16px" fontWeight="bold">會議時間</Th>
                        <Th fontSize="16px" fontWeight="bold">會議名稱</Th>
                        <Th fontSize="16px" fontWeight="bold">逐字稿與分析結果</Th>
                        <Th fontSize="16px" fontWeight="bold">相關連結</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {records.map(record => (
                        <Tr key={record.id}>
                            <Td>{new Date(record.datetime).toLocaleString()}</Td>
                            <Td>{record.title}</Td>
                            <Td>
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={() => {
                                        setSelectedRecord(record);
                                        onViewOpen();
                                    }}
                                >
                                    查看
                                </Button>
                            </Td>
                            <Td>
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={() => {
                                        setSelectedNoteRecord(record);
                                        onNoteOpen();
                                    }}
                                >
                                    查看
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* Modal - 新增會議紀錄 */}
            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalContent bg="#F9FAFC" p={4} borderRadius="25px">
                    <ModalCloseButton />
                    <ModalBody mt="8">
                        <MeetSure projectId={projectId} onCancel={onClose} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal - 查看逐字稿與 AI 分析 */}
            <Modal isOpen={isViewOpen} onClose={onViewClose} size="6xl">
                <ModalOverlay />
                <ModalContent bg="#F9FAFC" p={4} borderRadius="25px">
                    <ModalHeader />
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedRecord && (
                            <Box>
                                <Text fontSize="xl" fontWeight="bold" mb="2">📅 會議時間</Text>
                                <Text fontSize="18px" mb="4">{new Date(selectedRecord.datetime).toLocaleString()}</Text>

                                <Text fontSize="xl" fontWeight="bold" mb="2">📝 會議名稱</Text>
                                <Text fontSize="18px" mb="6">{selectedRecord.title}</Text>

                                <Box display="flex" gap="24px">
                                    <Box flex="1">
                                        <Text fontSize="xl" fontWeight="bold" mb="2">📄 逐字稿</Text>
                                        <Box
                                            p="4"
                                            bg="gray.100"
                                            borderRadius="md"
                                            whiteSpace="pre-wrap"
                                            maxHeight="500px"
                                            overflowY="auto"
                                        >
                                            {selectedRecord.transcript}
                                        </Box>
                                    </Box>

                                    <Box flex="1">
                                        <Text fontSize="xl" fontWeight="bold" mb="2">🤖 AI 分析</Text>
                                        <Box
                                            p="4"
                                            bg="gray.100"
                                            borderRadius="md"
                                            whiteSpace="pre-wrap"
                                            maxHeight="500px"
                                            overflowY="auto"
                                        >
                                            {selectedRecord.analysis}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onViewClose} colorScheme="gray">
                            關閉
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal - 查看 notes 補充資訊 */}
            <Modal isOpen={isNoteOpen} onClose={onNoteClose} size="4xl">
                <ModalOverlay />
                <ModalContent bg="#F9FAFC" p={6} borderRadius="25px">
                    <ModalHeader fontSize="xl" fontWeight="bold">📎 補充資訊</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedNoteRecord?.notes ? (
                            <Box
                                p="4"
                                bg="gray.100"
                                borderRadius="md"
                                whiteSpace="pre-wrap"
                                maxHeight="400px"
                                overflowY="auto"
                            >
                                {selectedNoteRecord.notes}
                            </Box>
                        ) : (
                            <Text color="gray.500">此筆會議尚無補充資訊。</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onNoteClose} colorScheme="gray">
                            關閉
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default MeetingDataList;
