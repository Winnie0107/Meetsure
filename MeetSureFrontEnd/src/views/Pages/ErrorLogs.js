import React from "react";
import { Box, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Tooltip, Flex } from "@chakra-ui/react";
import { formatDistanceToNow, format } from "date-fns";
import { zhTW } from "date-fns/locale";


const ErrorLogs = () => {
    // 範例資料，包含錯誤時間
    const sampleData = [
        { user: "user1", error: "連接超時錯誤", time: new Date(2024, 11, 14, 18, 0) },
        { user: "user2", error: "權限不足", time: new Date(2024, 11, 14, 15, 30) },
    ];


    return (
        <Box display="flex" minH="100vh" bg="#F1F5F9">
            {/* 主內容區域 */}
            <Box flex="1" p="20px" bg="#F8FAFC">
                {/* 頁面標題 */}
                <Text fontSize="24px" fontWeight="bold" color="#319795" mb="20px">
                    錯誤訊息檢視
                </Text>


                {/* 搜尋功能 */}
                <Flex mb="20px" align="center" gap="10px">
                    <Input placeholder="請輸入用戶帳號或錯誤訊息" size="md" />
                    <Button colorScheme="blue">搜尋</Button>
                </Flex>


                {/* 資料表格 */}
                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead bg="#E2E8F0">
                            <Tr>
                                <Th>
                                    <Checkbox />
                                </Th>
                                <Th>用戶帳號</Th>
                                <Th>操作記錄</Th>
                                <Th>錯誤訊息</Th>
                                <Th>發生時間</Th>
                                <Th>處理狀態</Th>
                                <Th>操作</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sampleData.map((item, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <Checkbox />
                                    </Td>
                                    <Td>{item.user}</Td>
                                    <Td>修改資料</Td>
                                    <Td>{item.error}</Td>
                                    <Td>
                                        <Tooltip label={format(item.time, "yyyy-MM-dd HH:mm")} aria-label="詳細時間">
                                            <Text cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                                {formatDistanceToNow(item.time, { addSuffix: true, locale: zhTW })}
                                            </Text>
                                        </Tooltip>
                                    </Td>
                                    <Td>
                                        <Text color="red.500">未處理</Text>
                                    </Td>
                                    <Td>
                                        <Button colorScheme="teal" size="sm" mr="2">
                                            查看
                                        </Button>
                                        <Button colorScheme="gray" size="sm">
                                            處理
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>


                {/* 分頁功能 */}
                <Flex justify="space-between" mt="20px">
                    <Text>已選取：0</Text>
                    <Flex gap="5px">
                        <Button size="sm">上一頁</Button>
                        <Button size="sm">1</Button>
                        <Button size="sm">2</Button>
                        <Button size="sm">下一頁</Button>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
};


export default ErrorLogs;
