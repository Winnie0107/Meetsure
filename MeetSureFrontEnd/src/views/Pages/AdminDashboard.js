import React from "react";
import { Box, Text, SimpleGrid, Stat, StatLabel, StatNumber, VStack, Flex, Icon, Badge, HStack } from "@chakra-ui/react";
import { AiOutlineUserAdd, AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";


const AdminDashboard = () => {
    const stats = [
        { label: "總用戶數", value: 1234 },
        { label: "待審批申請", value: 15 },
        { label: "錯誤報告", value: 8 },
        { label: "本月新增用戶", value: 120 },
    ];


    const activities = [
        {
            icon: AiOutlineUserAdd,
            type: "新增用戶",
            description: "用戶 A 新增了一個帳號",
            time: "10 分鐘前",
            color: "green.500",
        },
        {
            icon: AiOutlineCheckCircle,
            type: "批准申請",
            description: "公司申請已批准",
            time: "30 分鐘前",
            color: "blue.500",
        },
        {
            icon: AiOutlineExclamationCircle,
            type: "錯誤報告",
            description: "接收到一個新的錯誤報告 #123 ",
            time: "1 小時前",
            color: "red.500",
        },
    ];


    return (
        <Box>
            <Text fontSize="24px" fontWeight="bold" color="#319795" mb="20px">
                基本營運狀況
            </Text>


            {/* 數據概覽卡片 */}
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


            {/* 最近活動 */}
            <Box mt="40px">
                <Text fontSize="20px" fontWeight="bold" color="#2D3748" mb="20px">
                    最近活動
                </Text>
                <VStack spacing="20px" align="stretch">
                    {activities.map((activity, index) => (
                        <Flex
                            key={index}
                            p="15px"
                            bg="white"
                            borderRadius="8px"
                            boxShadow="sm"
                            transition="all 0.2s"
                            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                        >
                            {/* 左側圖標 */}
                            <Flex
                                align="center"
                                justify="center"
                                w="50px"
                                h="50px"
                                bg={`${activity.color}20`}
                                borderRadius="full"
                            >
                                <Icon as={activity.icon} boxSize="24px" color={activity.color} />
                            </Flex>


                            {/* 中間內容 */}
                            <Box flex="1" ml="15px">
                                <HStack justify="space-between">
                                    <Text fontWeight="bold" fontSize="16px" color="#2D3748">
                                        {activity.type}
                                    </Text>
                                    <Badge colorScheme={activity.color.replace(".500", "")}>{activity.time}</Badge>
                                </HStack>
                                <Text mt="5px" fontSize="14px" color="gray.600">
                                    {activity.description}
                                </Text>
                            </Box>
                        </Flex>
                    ))}
                </VStack>
            </Box>
        </Box>
    );
};


export default AdminDashboard;
