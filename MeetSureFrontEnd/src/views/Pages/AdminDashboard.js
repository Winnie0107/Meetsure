import React, { useEffect, useState } from "react";
import {
    Box, Text, SimpleGrid, Stat, StatLabel, StatNumber, VStack,
    Flex, Icon, Badge, HStack, Spinner, Button
} from "@chakra-ui/react";
import { AiOutlineProject } from "react-icons/ai";
import axios from "axios";

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 3;

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchCompanyUsers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/company-users/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setUserCount(res.data.length);
            } catch (error) {
                console.error("載入使用者失敗：", error);
            }
        };

        const fetchInProgressProjects = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/projects/in-progress-count/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setProjectCount(res.data.count);
            } catch (err) {
                console.error("❌ 載入進行中專案失敗", err);
            }
        };

        const fetchCompanyProjects = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/projects/company-projects/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setProjects(res.data);
            } catch (err) {
                console.error("❌ 載入公司專案失敗", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyUsers();
        fetchInProgressProjects();
        fetchCompanyProjects();

    }, []);

    // Pagination Logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const stats = [
        { label: "總用戶數", value: userCount },
        { label: "進行中專案數", value: projectCount },
    ];

    return (
        <Box>
            <Text fontSize="24px" fontWeight="bold" color="#319795" mb="20px">
                基本營運狀況
            </Text>

            <SimpleGrid columns={[1, 2, 4]} spacing="20px" mb="40px" minChildWidth="240px">
                {stats.map((stat, index) => (
                    <Box
                        key={index}
                        bg="white"
                        p="20px"
                        borderRadius="8px"
                        boxShadow="sm"
                        _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                    >
                        <Stat>
                            <StatLabel color="gray.500" fontSize="14px">
                                {stat.label}
                            </StatLabel>
                            <StatNumber fontSize="20px" fontWeight="bold" color="#319795">
                                {stat.value}
                            </StatNumber>
                        </Stat>
                    </Box>
                ))}
            </SimpleGrid>

            <Box mt="40px">
                <Text fontSize="20px" fontWeight="bold" color="#2D3748" mb="20px">
                    目前公司進行專案
                </Text>

                {loading ? (
                    <Spinner color="#319795" size="lg" />
                ) : (

<VStack spacing="20px" align="stretch" position="relative">
  {currentProjects.map((project, index) => (
    <Flex
      key={index}
      p="15px"
      bg="white"
      borderRadius="8px"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="center" w="50px" h="50px" >
        <Icon as={AiOutlineProject} boxSize="24px" color="purple.500" />
      </Flex>
      <Box flex="1" ml="15px">
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="16px" color="#2D3748">
            {project.name}
          </Text>
          <Badge colorScheme="blue">
            進行中 · {calculateProjectProgress(project.tasks)}%
          </Badge>
        </HStack>
        <Text mt="5px" fontSize="14px" color="gray.600">
          {project.description}
        </Text>
      </Box>
    </Flex>
  ))}

  <HStack
    justify="flex-end"
    spacing={2}
    position="absolute"
    bottom="-40px"
    right="0"
  >
    <Button
      onClick={() => paginate(currentPage - 1)}
      colorScheme="gray"
      variant="outline"
      size="sm"
      isDisabled={currentPage === 1}
    >
      上一頁
    </Button>

    {[...Array(Math.ceil(projects.length / projectsPerPage)).keys()].slice(0, 3).map(number => (
      <Button
        key={number + 1}
        onClick={() => paginate(number + 1)}
        colorScheme="gray"
        variant={currentPage === number + 1 ? "solid" : "outline"}
        size="sm"
      >
        {number + 1}
      </Button>
    ))}

    <Button
      onClick={() => paginate(currentPage + 1)}
      colorScheme="gray"
      variant="outline"
      size="sm"
      isDisabled={currentPage === Math.ceil(projects.length / projectsPerPage)}
    >
      下一頁
    </Button>
  </HStack>
</VStack>


                )}
            </Box>
        </Box>
    );
};

const calculateProjectProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
};

export default AdminDashboard;
