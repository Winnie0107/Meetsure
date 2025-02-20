import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  useColorMode,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import {
  ArgonLogoDark,
  ArgonLogoLight,
  ChakraLogoDark,
  ChakraLogoLight,
} from "components/Icons/Icons";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons"; // 引入帶一槓的左箭頭圖示
import routes from "routes.js";

export default function AuthNavbar(props) {
  const { logo, logoText, secondary, ...rest } = props;
  const { colorMode } = useColorMode();

  // Chakra color mode
  let mainText = "white";
  let navbarIcon = "white";
  let navbarBg = "none";
  let navbarBorder = "none";
  let navbarShadow = "initial";
  let navbarFilter = "initial";
  let navbarBackdrop = "none";
  let bgButton = useColorModeValue("white", "navy.900");
  let colorButton = useColorModeValue("gray.700", "white");
  let navbarPosition = "absolute";
  let hamburgerColor = {
    base: useColorModeValue("gray.700", "white"),
    md: "white",
  };

  let brand = (
    <Link
      href={`${process.env.PUBLIC_URL}/#/`}
      target="_blank"
      display="flex"
      lineHeight="100%"
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      color={mainText}
    >
    </Link>
  );

  // 使用帶一槓的左箭頭作為主控版按鍵
  var linksAuth = (
    <HStack display={{ sm: "none", lg: "flex" }}>
      <NavLink to="/admin/dashboard">
        <Button
          fontSize="lg" // 增大字型
          color="white" // 設置按鍵顏色為白色
          variant="no-effects"
          leftIcon={
            <Icon as={ArrowBackIcon} w={8} h={8} color="white" /> // 使用 ArrowBackIcon 並設置尺寸
          }
        />
      </NavLink>
    </HStack>
  );

  return (
    <Flex
      position={navbarPosition}
      top="16px"
      left="0" // 將位置設置為最左側
      background={navbarBg}
      border={navbarBorder}
      boxShadow={navbarShadow}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderRadius="15px"
      px="16px"
      py="22px"
      mx="auto"
      width="1044px"
      maxW="90%"
      alignItems="center"
      zIndex="3"
    >
      <Flex w="100%" justifyContent="space-between">
        {/* 將主控版按鍵移到最左邊 */}
        {linksAuth}
        <Box
          ms={{ base: "auto", lg: "0px" }}
          display={{ base: "flex", lg: "none" }}
        >
          <SidebarResponsive
            hamburgerColor={hamburgerColor}
            logoText={props.logoText}
            secondary={props.secondary}
            routes={routes}
            logo={
              <Stack
                direction="row"
                spacing="12px"
                align="center"
                justify="center"
              >
                {colorMode === "dark" ? (
                  <ArgonLogoLight w="74px" h="27px" />
                ) : (
                  <ArgonLogoDark w="74px" h="27px" />
                )}
                <Box
                  w="1px"
                  h="20px"
                  bg={colorMode === "dark" ? "white" : "gray.700"}
                />
                {colorMode === "dark" ? (
                  <ChakraLogoLight w="82px" h="21px" />
                ) : (
                  <ChakraLogoDark w="82px" h="21px" />
                )}
              </Stack>
            }
            {...rest}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
