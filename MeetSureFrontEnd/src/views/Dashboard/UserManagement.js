// Chakra imports
import {
    Flex,
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import UsersTableRow from "components/Tables/UsersTableRow";
import React, { useEffect, useState } from "react";
import axios from "axios";

function UserManagement() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const [users, setUsers] = useState([]); // 用於存儲用戶資料
    const [loading, setLoading] = useState(true); // 用於顯示加載狀態

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('${process.env.REACT_APP_API_URL}/users/');
                setUsers(response.data); // 設置用戶資料
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // 完成加載
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>; // 加載狀態
    }

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
                <CardHeader p="6px 0px 22px 0px">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        Users Table
                    </Text>
                </CardHeader>
                <CardBody>
                    <Table variant="simple" color={textColor}>
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th pl="0px" borderColor={borderColor} color="gray.400">Email</Th>
                                <Th borderColor={borderColor} color="gray.400">Password</Th>
                                <Th borderColor={borderColor} color="gray.400">Level</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users.map((users) => (
                                <UsersTableRow
                                    mail={users.mail}
                                    password={users.password}
                                    level={users.level}
                                // 根據需要調整其他屬性
                                />
                            ))}
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
        </Flex>
    );
}

export default UserManagement;
