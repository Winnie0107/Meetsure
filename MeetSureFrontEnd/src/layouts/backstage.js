import React, { useEffect } from "react";
import { Box, Text, VStack, Flex, Icon } from "@chakra-ui/react";
import {
    AiOutlineHome,
    AiOutlineGlobal,
    AiOutlineCheckCircle,
    AiOutlineUpload,
    AiOutlineLogout,
} from "react-icons/ai";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import AdminDashboard from "views/Pages/AdminDashboard.js";
import AccountManagement from "views/Pages/AccountManagement.js";
import CompanyApply from "views/Pages/CompanyApply.js";
import ErrorLogs from "views/Pages/ErrorLogs.js";


const Backstage = () => {
    const history = useHistory();


    // 登入檢查邏輯
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const role = localStorage.getItem("role");


        if (!userId || !role) {
            // 若無登入資訊，跳轉到登入頁面
            history.push("/#/auth/homepage"); // 假設登入頁面的路徑是 "/login"
        }
    }, [history]);


    const navItems = [
        { icon: AiOutlineHome, text: "基本營運狀況", link: "/backstage/admindashboard" },
        { icon: AiOutlineGlobal, text: "用戶/權限管理", link: "/backstage/account-management" },
      
        { icon: AiOutlineLogout, text: "登出", action: () => handleLogout() },
    ];


    // 登出邏輯
    const handleLogout = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");
        history.push("/#/auth/homepage"); // 跳轉到登入頁面
    };


    return (
        <Box display="flex" minH="100vh" bg="#F1F5F9">
            {/* 左側導航欄 */}
            <Box
                w="240px"
                bg="#1E293B"
                color="#E2E8F0"
                p="20px"
                display="flex"
                flexDirection="column"
                position="fixed"
                h="100vh"
            >
                <Text fontSize="24px" fontWeight="bold" color="#81E6D9" mb="20px">
                    功能選單
                </Text>
                <VStack spacing="4" align="start">
                    {navItems.map((item, index) => (
                        <Flex
                            key={index}
                            as={item.link ? Link : "div"}
                            to={item.link}
                            align="center"
                            p="10px"
                            w="100%"
                            borderRadius="8px"
                            cursor="pointer"
                            transition="all 0.2s"
                            boxShadow="sm"
                            _hover={{
                                bg: "#319795",
                                color: "#FFFFFF",
                                transform: "translateY(-2px)",
                                boxShadow: "md",
                            }}
                            _active={{
                                bg: "#285E61",
                                transform: "translateY(2px)",
                                boxShadow: "lg",
                            }}
                            onClick={item.action}
                        >
                            <Icon as={item.icon} boxSize="6" mr="10px" />
                            <Text fontSize="16px">{item.text}</Text>
                        </Flex>
                    ))}
                </VStack>
            </Box>


            {/* 主內容區域 */}
            <Box flex="1" ml="240px" p="20px" bg="#F8FAFC">
                <Switch>
                    <Route path="/backstage/admindashboard" component={AdminDashboard} />
                    <Route path="/backstage/account-management" component={AccountManagement} />
                    <Route path="/backstage/company-apply" component={CompanyApply} />
                    <Route path="/backstage/error-logs" component={ErrorLogs} />
                </Switch>
            </Box>
        </Box>
    );
};


export default Backstage;
