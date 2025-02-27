import React from "react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Flex,
    Text,
    useColorModeValue,
    HStack,
} from "@chakra-ui/react";
import { PenIcon, ChatIcon, GlobeIcon } from "components/Icons/Icons";
import { CheckIcon } from "@chakra-ui/icons";
import AIWrite from "./AIWrite";
import AIChat from "./AIChat";
import AITranslate from "./AITranslate";
import AICheck from "./AICheck";


export default function AIToolsTabs() {
    const defaultTabBg = useColorModeValue("blue.100", "blue.700");
    const selectedTabBg = useColorModeValue("white", "blue.200");
    const hoverTabBg = useColorModeValue("blue.300", "blue.600");
    const borderColor = useColorModeValue("blue.500", "blue.300");
    const textColor = "black";


    return (
        <Flex
            direction="column"
            pt={{ base: "90px", md: "60px" }}
        >
            <Tabs variant="unstyled" isLazy align="start">
                {/* 標籤列 */}
                <TabList
                    display="flex"
                    mb="10px"
                    gap="8px"

                >
                    <Tab
                        bg={defaultTabBg}
                        border={`2px solid ${borderColor}`}
                        borderRadius="10px"
                        _selected={{
                            bg: selectedTabBg,
                            color: textColor,
                            border: `2px solid ${borderColor}`,
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        _hover={{
                            bg: hoverTabBg,
                            transform: "scale(1.05)",
                            transition: "all 0.2s ease-in-out",
                        }}
                        px="30px"
                        py="10px"
                        transition="all 0.3s ease-in-out"
                    >
                        <HStack spacing="12px">
                            <PenIcon />
                            <Text fontWeight="bold" fontSize="xl" color={textColor}>
                                AI 寫作
                            </Text>
                        </HStack>
                    </Tab>
                    <Tab
                        bg={defaultTabBg}
                        border={`2px solid ${borderColor}`}
                        borderRadius="10px"
                        _selected={{
                            bg: selectedTabBg,
                            color: textColor,
                            border: `2px solid ${borderColor}`,
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        _hover={{
                            bg: hoverTabBg,
                            transform: "scale(1.05)",
                            transition: "all 0.2s ease-in-out",
                        }}
                        px="30px"
                        py="10px"
                        transition="all 0.3s ease-in-out"
                    >
                        <HStack spacing="12px">
                            <ChatIcon />
                            <Text fontWeight="bold" fontSize="xl" color={textColor}>
                                AI 聊天室
                            </Text>
                        </HStack>
                    </Tab>
                    <Tab
                        bg={defaultTabBg}
                        border={`2px solid ${borderColor}`}
                        borderRadius="10px"
                        _selected={{
                            bg: selectedTabBg,
                            color: textColor,
                            border: `2px solid ${borderColor}`,
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        _hover={{
                            bg: hoverTabBg,
                            transform: "scale(1.05)",
                            transition: "all 0.2s ease-in-out",
                        }}
                        px="30px"
                        py="10px"
                        transition="all 0.3s ease-in-out"
                    >
                        <HStack spacing="12px">
                            <GlobeIcon />
                            <Text fontWeight="bold" fontSize="xl" color={textColor}>
                                AI 翻譯
                            </Text>
                        </HStack>
                    </Tab>
                    <Tab
                        bg={defaultTabBg}
                        border={`2px solid ${borderColor}`}
                        borderRadius="10px"
                        _selected={{
                            bg: selectedTabBg,
                            color: textColor,
                            border: `2px solid ${borderColor}`,
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        _hover={{
                            bg: hoverTabBg,
                            transform: "scale(1.05)",
                            transition: "all 0.2s ease-in-out",
                        }}
                        px="30px"
                        py="10px"
                        transition="all 0.3s ease-in-out"
                    >
                        <HStack spacing="12px">
                            <CheckIcon />
                            <Text fontWeight="bold" fontSize="xl" color={textColor}>
                                語法檢查
                            </Text>
                        </HStack>
                    </Tab>
                </TabList>


                {/* 標籤對應內容 */}
                <TabPanels p={0} mt="-80px">
                    <TabPanel p={0}>
                        <AIWrite />
                    </TabPanel>
                    <TabPanel p={0}>
                        <AIChat />
                    </TabPanel>
                    <TabPanel p={0}>
                        <AITranslate />
                    </TabPanel>
                    <TabPanel p={0}>
                        <AICheck />
                    </TabPanel>
                </TabPanels>

            </Tabs>
        </Flex>
    );
}
