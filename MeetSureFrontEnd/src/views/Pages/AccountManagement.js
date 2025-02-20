import React, { useState } from "react";
import {
    Box, Flex, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Checkbox,
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Select, Divider
} from "@chakra-ui/react";
import { AiOutlineCheckCircle, AiOutlineUpload, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";


const AccountManagement = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedCount, setSelectedCount] = useState(0);


    const handleEditClick = (row) => {
        setSelectedRow(row);
        setModalOpen(true);
    };


    const handleSave = () => {
        console.log("保存的數據:", selectedRow);
        setModalOpen(false);
    };


    const handleInputChange = (field, value) => {
        setSelectedRow((prev) => ({ ...prev, [field]: value }));
    };


    const handleCheckboxChange = (e) => {
        setSelectedCount(e.target.checked ? selectedCount + 1 : selectedCount - 1);
    };


    return (
        <Box display="flex" minH="100vh" bg="#F1F5F9">
            {/* 主內容區域 */}
            <Box flex="1" p="20px" bg="#F8FAFC">
                <Text fontSize="24px" fontWeight="bold" color="#319795" mb="20px">
                    用戶/權限管理
                </Text>


                <Flex mb="20px" gap="10px">
                    <Button colorScheme="teal">批次新增</Button>
                    <Button colorScheme="blue">匯入</Button>
                    <Button colorScheme="gray">匯出</Button>
                    <Button colorScheme="teal">新增使用者</Button>
                </Flex>


                <Flex mb="20px" align="center" gap="10px">
                    <Input placeholder="請輸入內容" size="md" />
                    <Button colorScheme="blue">搜尋</Button>
                </Flex>


                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead bg="#E2E8F0">
                            <Tr>
                                <Th>
                                    <Checkbox onChange={handleCheckboxChange} />
                                </Th>
                                <Th>狀態</Th>
                                <Th>姓名</Th>
                                <Th>所有角色</Th>
                                <Th>所屬團隊</Th>
                                <Th>所屬公司</Th>
                                <Th>帳號</Th>
                                <Th>Email</Th>
                                <Th>操作</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Array(10)
                                .fill("")
                                .map((_, index) => {
                                    const row = {
                                        status: "啟用",
                                        name: `使用者姓名 ${index + 1}`,
                                        role: "使用者",
                                        team: `團隊 ${index + 1}`,
                                        company: "財務部",
                                        account: `09123456${index}`,
                                        email: `user${index}@example.com`,
                                    };
                                    return (
                                        <Tr key={index}>
                                            <Td>
                                                <Checkbox onChange={handleCheckboxChange} />
                                            </Td>
                                            <Td>
                                                <Text color="green.500">{row.status}</Text>
                                            </Td>
                                            <Td>{row.name}</Td>
                                            <Td>{row.role}</Td>
                                            <Td>{row.team}</Td>
                                            <Td>{row.company}</Td>
                                            <Td>{row.account}</Td>
                                            <Td>{row.email}</Td>
                                            <Td>
                                                <Button
                                                    colorScheme="teal"
                                                    size="sm"
                                                    mr="2"
                                                    onClick={() => handleEditClick(row)}
                                                >
                                                    修改
                                                </Button>
                                                <Button
                                                    bg="gray.500"
                                                    color="white"
                                                    size="sm"
                                                    _hover={{ bg: "gray.600" }}
                                                >
                                                    刪除
                                                </Button>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </Box>


                {/* 分頁控制 */}
                <Flex justify="space-between" mt="20px">
                    <Text>已選取：{selectedCount}</Text>
                    <Flex gap="5px">
                        <Button size="sm">上一頁</Button>
                        <Button size="sm">1</Button>
                        <Button size="sm">2</Button>
                        <Button size="sm">下一頁</Button>
                    </Flex>
                </Flex>
            </Box>


            {/* 修改彈窗 */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <ModalOverlay />
                <ModalContent borderRadius="10px" boxShadow="lg" bg="#FFFFFF">
                    <ModalHeader bg="#4C9E9A" color="white" borderTopRadius="10px">
                        修改使用者資料
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Divider mb="4" />
                        {selectedRow && (
                            <>
                                <FormControl mb="4">
                                    <FormLabel>姓名</FormLabel>
                                    <Input
                                        value={selectedRow.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mb="4">
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        value={selectedRow.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mb="4">
                                    <FormLabel>權限</FormLabel>
                                    <Select
                                        placeholder="選擇權限"
                                        value={selectedRow.role}
                                        onChange={(e) => handleInputChange("role", e.target.value)}
                                    >
                                        <option value="一般使用者">一般使用者</option>
                                        <option value="公司使用者">公司使用者</option>
                                        <option value="公司管理員">公司管理員</option>
                                        <option value="專案組長">專案組長</option>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </ModalBody>
                    <Divider />
                    <ModalFooter>
                        <Button colorScheme="teal" mr="3" onClick={handleSave}>
                            保存
                        </Button>
                        <Button bg="gray.300" color="black" _hover={{ bg: "gray.400" }} onClick={() => setModalOpen(false)}>
                            取消
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    );
};


export default AccountManagement;
