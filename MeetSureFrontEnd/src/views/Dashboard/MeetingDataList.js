import React, { useState } from "react";
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
import MeetSure from "./MeetSure"; // 確保 `MeetSure.js` 的路徑正確

const MeetingDataList = () => {
    const cardBg = useColorModeValue("white", "gray.800");
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Card flex="3" p="6" bg={cardBg} boxShadow="lg">
            {/* 標題區域 */}
            <CardHeader pb="4" display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold">專案會議記錄</Text>
                <Button size="md" colorScheme="gray" onClick={onOpen}>
                    上傳會議紀錄
                </Button>
            </CardHeader>
            <Divider my="2" />

            {/* 會議記錄表格 */}
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

            {/* 📌 Modal - 新增會議紀錄 */}
            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalContent bg="#F9FAFC">
                    <ModalCloseButton />
                    <ModalBody mt="8">
                        <MeetSure /> {/* 🚀 直接載入 MeetSure.js 內容 */}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            取消
                        </Button>
                        <Button colorScheme="teal">確認新增</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default MeetingDataList;
