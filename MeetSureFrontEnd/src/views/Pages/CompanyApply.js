import React, { useState } from "react";
import {
    Box,
    Text,
    Button,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Checkbox,
    Flex,
} from "@chakra-ui/react";


const CompanyApply = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    const pendingApplications = Array(15).fill({
        company: "未批准公司",
        email: "pending@example.com",
        password: "******",
    });


    const approvedApplications = Array(15).fill({
        company: "已批准公司",
        email: "approved@example.com",
        password: "******",
    });


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const paginate = (items) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };


    return (
        <Box display="flex" minH="100vh" bg="#F1F5F9">
            {/* 主內容區域 */}
            <Box flex="1" p="20px" bg="#F8FAFC">
                <Text fontSize="24px" fontWeight="bold" color="#319795" mb="20px">
                    批准公司帳號申請
                </Text>


                <Tabs variant="enclosed" colorScheme="teal" onChange={(index) => setSelectedTab(index)}>
                    <TabList>
                        <Tab>未批准</Tab>
                        <Tab>已批准</Tab>
                    </TabList>


                    <TabPanels>
                        {/* 未批准表格 */}
                        <TabPanel>
                            <Flex justify="space-between" mb="4">
                                <Text fontSize="18px" fontWeight="medium" color="#1E293B"></Text>
                                <Input
                                    placeholder="搜尋公司名稱或 Email"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    w="300px"
                                    bg="white"
                                />
                            </Flex>
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead bg="#E2E8F0">
                                        <Tr>
                                            <Th>
                                                <Checkbox />
                                            </Th>
                                            <Th>所屬公司</Th>
                                            <Th>Email</Th>
                                            <Th>密碼</Th>
                                            <Th>操作</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {paginate(pendingApplications).map((application, index) => (
                                            <Tr key={index}>
                                                <Td>
                                                    <Checkbox />
                                                </Td>
                                                <Td>{application.company}</Td>
                                                <Td>{application.email}</Td>
                                                <Td>{application.password}</Td>
                                                <Td>
                                                    <Button colorScheme="teal" size="sm" mr="2">
                                                        批准
                                                    </Button>
                                                    <Button bg="gray.500" color="white" size="sm" _hover={{ bg: "gray.600" }}>
                                                        刪除
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>


                        {/* 已批准表格 */}
                        <TabPanel>
                            <Flex justify="space-between" mb="4">
                                <Text fontSize="18px" fontWeight="medium" color="#1E293B"></Text>
                                <Input
                                    placeholder="搜尋公司名稱或 Email"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    w="300px"
                                    bg="white"
                                />
                            </Flex>
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead bg="#E2E8F0">
                                        <Tr>
                                            <Th>所屬公司</Th>
                                            <Th>Email</Th>
                                            <Th>密碼</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {paginate(approvedApplications).map((application, index) => (
                                            <Tr key={index}>
                                                <Td>{application.company}</Td>
                                                <Td>{application.email}</Td>
                                                <Td>{application.password}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>


                {/* 分頁控制 */}
                <Flex justify="space-between" mt="20px">
                    <Text>已選取：0</Text>
                    <Flex gap="5px">
                        <Button
                            size="sm"
                            isDisabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            上一頁
                        </Button>
                        <Button size="sm">{currentPage}</Button>
                        <Button
                            size="sm"
                            isDisabled={currentPage === Math.ceil(pendingApplications.length / itemsPerPage)}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            下一頁
                        </Button>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
};


export default CompanyApply;
