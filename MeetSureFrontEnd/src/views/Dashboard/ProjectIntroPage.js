import React from "react";
import { useColorModeValue, Image, Flex, Box, Text, Button, VStack, HStack, Divider, Icon } from "@chakra-ui/react";
import { MdNotificationsActive, MdTaskAlt } from "react-icons/md";
import { FaFileAudio } from "react-icons/fa"; // 替代會議影音逐字稿圖標
import { FiMessageCircle, FiFolder } from "react-icons/fi";
import Card from "components/Card/Card.js";
import BuildProjectImage from "assets/img/BuildProgect.png";

function ProjectIntroPage({ onStart }) {
    const textColor = useColorModeValue("gray.700", "white");

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }} mx="auto">
            {/* 專案介紹卡片 */}
            <Card my="22px" w="100%" pb="0px" height="auto" boxShadow="lg">
                <Box p="6">
                    {/* 設定流程區塊 */}
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        Introduce. 歡迎使用專案管理功能，以下是專案建立流程：
                    </Text>

                    <Text mt="3" color={textColor}>
                        從初始設置到專案管理，我們提供直觀的引導與工具，讓您輕鬆上手。
                    </Text>

                    <Box textAlign="center" mb="8">
                        <Image
                            src={BuildProjectImage}
                            alt="流程圖片"
                            maxWidth="100%"
                            borderRadius="lg"
                            boxSize="100%"
                        />
                    </Box>

                    {/* 下一步按鈕 */}
                    <Box mb="10" display="flex" justifyContent="center">
                        <Button colorScheme="teal" onClick={onStart}>
                            開始建立專案
                        </Button>
                    </Box>

                    <Divider my="6" />

                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        專案管理核心功能
                    </Text>
                    <Text mt="3" color={textColor}>
                        MeetSure 提供一個完整的專案流程，幫助您更高效地管理專案。以下是我們的核心功能：
                    </Text>

                    {/* 主要功能顯示區塊 */}
                    <VStack spacing={10} align="start" mt="8">
                        <HStack spacing={20} justify="space-around" wrap="nowrap" ml="12">
                            {[
                                { icon: MdNotificationsActive, text: "自動化通知系統" },
                                { icon: MdTaskAlt, text: "任務進度追蹤" },
                                { icon: FaFileAudio, text: "會議影音生成逐字稿與分析" },
                                { icon: FiMessageCircle, text: "團隊協作討論區" },
                                { icon: FiFolder, text: "文件共享與協作" },
                            ].map((feature, index) => (
                                <Flex
                                    key={index}
                                    direction="column"
                                    align="center"
                                    textAlign="center"
                                    width="20%"
                                    p={4} // 内边距增加一些
                                    cursor="pointer"
                                    borderRadius="xl" // 圆角效果
                                    _hover={{
                                        transform: "scale(1.1)", // 放大效果
                                        boxShadow: "xl", // 添加阴影
                                        backgroundColor: "gray.100", // 背景变为浅灰色
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                                    }}
                                >
                                    <Icon as={feature.icon} w={10} h={10} color="teal" />
                                    <Text mt="2" fontWeight="bold" color={textColor}>
                                        {feature.text}
                                    </Text>
                                </Flex>
                            ))}
                        </HStack>
                    </VStack>
                </Box>
            </Card>
        </Flex>
    );
}

export default ProjectIntroPage;