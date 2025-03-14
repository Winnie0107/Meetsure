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
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from "@chakra-ui/react";

const CompanyApply = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDescription, setSelectedDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const itemsPerPage = 5;

    const pendingApplications = Array.from({ length: 15 }, (_, index) => ({
        id: index,
        company: `未批准公司 ${index + 1}`,
        owner: "張三",
        description: "這是一個未批准公司的簡介描述。",
        plan: "基本方案",
    }));

    const approvedApplications = Array.from({ length: 15 }, (_, index) => ({
        id: index,
        company: `已批准公司 ${index + 1}`,
        owner: "李四",
        description: "這是一個已批准公司的簡介描述。",
        plan: "進階方案",
    }));

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginate = (items) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleViewDescription = (description) => {
        setSelectedDescription(description);
        onOpen();
    };

    const handleSelectCompany = (id) => {
        setSelectedCompanies((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleApproveSelected = () => {
        console.log("批准以下公司:", selectedCompanies);
    };

    return (
        <Box display="flex" minH="100vh" bg="#F1F5F9">
            <Box flex="1" p="20px" bg="#F8FAFC">
                <Text fontSize="24px" fontWeight="bold" color="#319795" mb="20px">
                    批准公司帳號申請
                </Text>
                <Flex justify="flex-end" mb="4" gap="10px">
                    <Input
                        placeholder="搜尋公司名稱或 負責人"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        w="300px"
                        bg="white"
                    />
                    <Button colorScheme="teal" onClick={handleApproveSelected} isDisabled={selectedCompanies.length === 0}>
                        批准選取的公司
                    </Button>
                </Flex>
                <Tabs variant="enclosed" colorScheme="teal">
                    <TabList>
                        <Tab>未批准</Tab>
                        <Tab>已批准</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead bg="#E2E8F0">
                                        <Tr>
                                            <Th>選取</Th>
                                            <Th>公司名稱</Th>
                                            <Th>負責人</Th>
                                            <Th>方案</Th>
                                            <Th>簡介描述</Th>
                                            <Th>操作</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {paginate(pendingApplications).map((application) => (
                                            <Tr key={application.id}>
                                                <Td>
                                                    <Checkbox isChecked={selectedCompanies.includes(application.id)} onChange={() => handleSelectCompany(application.id)} />
                                                </Td>
                                                <Td>{application.company}</Td>
                                                <Td>{application.owner}</Td>
                                                <Td>{application.plan}</Td>
                                                <Td>
                                                    <Button size="sm" onClick={() => handleViewDescription(application.description)}>
                                                        查看
                                                    </Button>
                                                </Td>
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
                        <TabPanel>
                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead bg="#E2E8F0">
                                        <Tr>
                                            <Th>公司名稱</Th>
                                            <Th>負責人</Th>
                                            <Th>方案</Th>
                                            <Th>簡介描述</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {paginate(approvedApplications).map((application) => (
                                            <Tr key={application.id}>
                                                <Td>{application.company}</Td>
                                                <Td>{application.owner}</Td>
                                                <Td>{application.plan}</Td>
                                                <Td>
                                                    <Button size="sm" onClick={() => handleViewDescription(application.description)}>
                                                        查看
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                          
                        </TabPanel>
                    </TabPanels>
                    <Flex justify="flex-end" mt="6" gap="6px" alignItems="center">
                    <Button size="sm" isDisabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                    上一頁
                    </Button>
                    <Text fontSize="md" fontWeight="medium">{currentPage}</Text>
                    
                    <Button size="sm" isDisabled={currentPage === Math.ceil(pendingApplications.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
                        下一頁
                     </Button>
                    </Flex>
                </Tabs>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>公司簡介描述</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>{selectedDescription}</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default CompanyApply;