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
    useDisclosure,
    Icon,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    useToast,
    Stack,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import MeetSure from "./MeetSure";
import { HiOutlineTrash } from "react-icons/hi";
import { FiPlus, FiSearch } from "react-icons/fi";

const MeetingDataList = ({ projectId }) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const [searchQuery, setSearchQuery] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

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

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose
    } = useDisclosure();


    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [selectedNoteRecord, setSelectedNoteRecord] = useState(null);
    const token = localStorage.getItem("token");
    const [copyTranscriptText, setCopyTranscriptText] = useState("複製文本");
    const [copyAnalysisText, setCopyAnalysisText] = useState("複製文本");


    useEffect(() => {
        if (projectId) {
            axios.get(`${process.env.REACT_APP_API_URL}/meeting-records/${projectId}/`)
                .then(res => {
                    setRecords(res.data);
                })
                .catch(err => {
                    console.error("❌ 會議紀錄讀取失敗：", err);
                });
        }
    }, [projectId]);

    const handleDeleteRecord = async () => {
        if (!selectedRecord) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/meeting-records/delete/${selectedRecord.id}/`, {
                headers: {
                    Authorization: `Token ${token}`
                  }
            });
            setRecords(prev => prev.filter(r => r.id !== selectedRecord.id));
            onDeleteModalClose();
        } catch (error) {
            console.error("❌ 刪除失敗：", error);
            alert("刪除失敗，請稍後再試！");
        }
    };

    const [titleSearch, setTitleSearch] = useState("");
    const [keywordSearch, setKeywordSearch] = useState("");

    const filteredRecords = records
        .map(record => {
            const matchFields = [];
            const keyword = keywordSearch.toLowerCase();

            if (record.transcript?.toLowerCase().includes(keyword)) {
                matchFields.push("逐字稿");
            }
            if (record.analysis?.toLowerCase().includes(keyword)) {
                matchFields.push("AI 分析");
            }
            if (record.notes?.toLowerCase().includes(keyword)) {
                matchFields.push("相關連結");
            }

            return {
                ...record,
                matchFields,
            };
        })
        .filter(record =>
            record.title.toLowerCase().includes(titleSearch.toLowerCase()) &&
            (keywordSearch === "" || record.matchFields.length > 0)
        );


    const handleUpdateRecord = async () => {
        try {
            const { id, title, datetime, transcript, analysis } = selectedRecord;

            // ✅ 修正這邊：把 datetime-local 格式轉成 UTC ISO
            const localDate = new Date(datetime);
            const utcDatetime = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();

            await axios.put(`${process.env.REACT_APP_API_URL}/meeting-records/update/${id}/`, {
                title,
                datetime, // ⬅️ 原樣送出，如 '2025-03-23T23:00'
                transcript,
                analysis,
            }, {
                headers: {
                    Authorization: `Token ${token}`
                  }
            });

            setRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === id
                        ? { ...record, title, datetime, transcript, analysis }
                        : record
                )
            );

            toast({
                title: "✅ 會議記錄已更新！",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });

            onViewClose();

        } catch (error) {
            console.error("❌ 更新失敗：", error);
            toast({
                title: "更新錯誤",
                description: error.response?.data?.error || error.message,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        }
    };



    return (
        <Card flex="3" p="6" bg={cardBg} boxShadow="lg">
            <CardHeader pb="4" display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold" ml="2">專案會議記錄</Text>
                <Flex alignItems="center" gap="12px">
                    {/* 會議名稱搜尋 */}
                    <InputGroup width="220px" borderRadius="full" boxShadow="sm">
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FiSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="搜尋會議名稱..."
                            value={titleSearch}
                            onChange={(e) => setTitleSearch(e.target.value)}
                            size="md"
                            borderRadius="full"
                            borderColor="gray.300"
                        />
                    </InputGroup>

                    {/* 關鍵字搜尋 */}
                    <InputGroup width="220px" borderRadius="full" boxShadow="sm">
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FiSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="搜尋關鍵詞..."
                            value={keywordSearch}
                            onChange={(e) => setKeywordSearch(e.target.value)}
                            size="md"
                            borderRadius="full"
                            borderColor="gray.300"
                        />
                    </InputGroup>

                    <Button size="md" colorScheme="teal" onClick={onOpen}>
                        上傳會議紀錄
                    </Button>
                </Flex>

            </CardHeader>
            <Divider my="2" />

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th fontSize="16px" fontWeight="bold">會議時間</Th>
                        <Th fontSize="16px" fontWeight="bold">會議名稱</Th>
                        <Th fontSize="16px" fontWeight="bold">逐字稿與分析結果</Th>
                        <Th fontSize="16px" fontWeight="bold">相關連結</Th>
                        <Th fontSize="16px" fontWeight="bold"></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredRecords.map(record => (
                        <React.Fragment key={record.id}>
                            <Tr>
                                <Td width="30%">
                                    {new Date(record.datetime).toLocaleString('zh-TW', {
                                        timeZone: 'Asia/Taipei',
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}
                                </Td>
                                <Td width="30%">{record.title}</Td>
                                <Td width="15%">
                                    <Button
                                        size="sm"
                                        colorScheme="gray"
                                        onClick={() => {
                                            setSelectedRecord(record);
                                            onViewOpen();
                                        }}
                                    >
                                        查看
                                    </Button>
                                </Td>
                                <Td width="15%">
                                    <Button
                                        size="sm"
                                        colorScheme="gray"
                                        onClick={() => {
                                            setSelectedNoteRecord(record);
                                            onNoteOpen();
                                        }}
                                    >
                                        查看
                                    </Button>
                                </Td>
                                <Td width="10%">
                                    <Button
                                        size="md"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedRecord(record);onDeleteModalOpen();
                                        }}
                                    >
                                        <Icon as={HiOutlineTrash} boxSize={6} />
                                    </Button>
                                </Td>
                            </Tr>

                            {/* 顯示關鍵字提示（獨立一行） */}
                            {keywordSearch && record.matchFields?.length > 0 && (
                                <Tr>
                                    <Td colSpan={5}>
                                        <Text fontSize="sm" color="gray.500" mt="1">
                                            🔍 關鍵詞位於：{record.matchFields.join("、")}
                                        </Text>
                                    </Td>
                                </Tr>
                            )}
                        </React.Fragment>
                    ))}

                </Tbody>
            </Table>

            {/* Modal - 新增會議紀錄 */}
            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalContent bg="#F9FAFC" p={4} borderRadius="25px">
                    <ModalCloseButton />
                    <ModalBody mt="8">
                        <MeetSure
                            projectId={projectId}
                            onCancel={onClose}
                            onSuccess={(newRecord) => {
                                setRecords(prev => [newRecord, ...prev]); // ⬅️ 加進最前面
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>


            {/* Modal - 刪除會議紀錄 */}
            <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="20px" p={4}>
                    <ModalHeader>確認刪除</ModalHeader>
                    <ModalBody>
                        <Text>您確定要刪除此會議記錄嗎？此操作無法復原。</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleDeleteRecord}>
                            確認刪除
                        </Button>
                        <Button onClick={onDeleteModalClose}>取消</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            {/* Modal - 查看逐字稿與 AI 分析 */}
            <Modal isOpen={isViewOpen} onClose={onViewClose} size="6xl">
                <ModalOverlay />
                <ModalContent bg="#F9FAFC" p={4} borderRadius="25px">
                    <ModalHeader fontSize="xl" fontWeight="bold">編輯會議記錄</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedRecord && (
                            <>
                                {/* ✅ 名稱 / 時間並排 */}
                                <Flex mb="10" gap="4">
                                    <Box flex="1">
                                        <Text fontSize="lg" mb="1" fontWeight="bold">會議名稱</Text>
                                        <Input
                                            value={selectedRecord.title}
                                            onChange={(e) =>
                                                setSelectedRecord({ ...selectedRecord, title: e.target.value })
                                            }
                                        />
                                    </Box>
                                    <Box flex="1">
                                        <Text fontSize="lg" mb="1" fontWeight="bold">會議時間</Text>
                                        <Input
                                            type="datetime-local"
                                            value={selectedRecord.datetime?.slice(0, 16)}
                                            onChange={(e) =>
                                                setSelectedRecord({ ...selectedRecord, datetime: e.target.value })
                                            }
                                        />
                                    </Box>

                                </Flex>

                                <Flex gap="24px">
                                    {/* Transcript 區塊 */}
                                    <Box flex="1">
                                        <Flex justify="space-between" align="center" mb="2">
                                            <Text fontSize="lg" fontWeight="bold">📄 逐字稿</Text>
                                            <Stack direction="row">
                                                <Button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(selectedRecord.transcript);
                                                        setCopyTranscriptText("已複製！");
                                                        setTimeout(() => setCopyTranscriptText("複製文本"), 2000);
                                                    }}
                                                >
                                                    {copyTranscriptText}
                                                </Button>

                                                <Button
                                                    onClick={() => {
                                                        const blob = new Blob([`\uFEFF${selectedRecord.transcript}`], {
                                                            type: "text/plain;charset=utf-8",
                                                        });
                                                        const link = document.createElement("a");
                                                        link.href = URL.createObjectURL(blob);
                                                        link.download = "transcript.txt";
                                                        link.click();
                                                    }}
                                                >
                                                    下載.txt
                                                </Button>
                                            </Stack>
                                        </Flex>
                                        <Textarea
                                            value={selectedRecord.transcript}
                                            onChange={(e) =>
                                                setSelectedRecord({ ...selectedRecord, transcript: e.target.value })
                                            }
                                            minHeight="650px"
                                            whiteSpace="pre-wrap"
                                        />
                                    </Box>

                                    {/* Analysis 區塊 */}
                                    <Box flex="1">
                                        <Flex justify="space-between" align="center" mb="2">
                                            <Text fontSize="lg" fontWeight="bold">🤖 AI 分析</Text>
                                            <Stack direction="row">
                                                <Button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(selectedRecord.analysis);
                                                        setCopyAnalysisText("已複製！");
                                                        setTimeout(() => setCopyAnalysisText("複製文本"), 2000);
                                                    }}
                                                >
                                                    {copyAnalysisText}
                                                </Button>


                                                <Button
                                                    onClick={() => {
                                                        const blob = new Blob([`\uFEFF${selectedRecord.analysis}`], {
                                                            type: "text/plain;charset=utf-8",
                                                        });
                                                        const link = document.createElement("a");
                                                        link.href = URL.createObjectURL(blob);
                                                        link.download = "ai_analysis.txt";
                                                        link.click();
                                                    }}
                                                >
                                                    下載.txt
                                                </Button>
                                            </Stack>
                                        </Flex>
                                        <Textarea
                                            value={selectedRecord.analysis}
                                            onChange={(e) =>
                                                setSelectedRecord({ ...selectedRecord, analysis: e.target.value })
                                            }
                                            minHeight="650px"
                                            whiteSpace="pre-wrap"
                                        />
                                    </Box>
                                </Flex>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleUpdateRecord}>
                            儲存
                        </Button>
                        <Button ml={3} onClick={onViewClose}></Button><Button ml={3} onClick={onViewClose}>
                            取消
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