// Chakra imports
/* eslint-disable no-unused-vars */

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Image,
  Link,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
import avatar6 from "assets/img/avatars/avatar6.png";
import ImageArchitect1 from "assets/img/ImageArchitect1.png";
import ImageArchitect2 from "assets/img/ImageArchitect2.png";
import ImageArchitect3 from "assets/img/ImageArchitect3.png";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";
import {
  FaCube,
  FaFacebook,
  FaInstagram,
  FaPenFancy,
  FaPlus,
  FaTwitter,
} from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";

function Profile() {
  const { colorMode } = useColorMode();

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("teal.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
      <Flex
        direction={{ sm: "column", md: "row" }}
        mb='24px'
        maxH='330px'
        justifyContent={{ sm: "center", md: "space-between" }}
        align='center'
        backdropFilter='blur(21px)'
        boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
        border='1.5px solid'
        borderColor={borderProfileColor}
        bg={bgProfile}
        p='24px'
        borderRadius='20px'>
        <Flex
          align='center'
          mb={{ sm: "10px", md: "0px" }}
          direction={{ sm: "column", md: "row" }}
          w={{ sm: "100%" }}
          textAlign={{ sm: "center", md: "start" }}>
          <Avatar
            me={{ md: "22px" }}
            src={avatar5}
            w='80px'
            h='80px'
            borderRadius='15px'
          />
          <Flex direction='column' maxWidth='100%' my={{ sm: "14px" }}>
            <Text
              fontSize={{ sm: "lg", lg: "xl" }}
              color={textColor}
              fontWeight='bold'
              ms={{ sm: "8px", md: "0px" }}>
              Alec Thompson
            </Text>
            <Text
              fontSize={{ sm: "sm", md: "md" }}
              color={emailColor}
              fontWeight='semibold'>
              alec@simmmple.com
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction={{ sm: "column", lg: "row" }}
          w={{ sm: "100%", md: "50%", lg: "auto" }}>
          <Button p='0px' bg='transparent' variant='no-effects'>
            <Flex
              align='center'
              w={{ sm: "100%", lg: "135px" }}
              bg={colorMode === "dark" ? "navy.900" : "#fff"}
              borderRadius='8px'
              justifyContent='center'
              py='10px'
              boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.06)'
              cursor='pointer'>
              <Icon color={textColor} as={FaCube} me='6px' />
              <Text fontSize='xs' color={textColor} fontWeight='bold'>
                OVERVIEW
              </Text>
            </Flex>
          </Button>
          <Button p='0px' bg='transparent' variant='no-effects'>
            <Flex
              align='center'
              w={{ lg: "135px" }}
              borderRadius='15px'
              justifyContent='center'
              py='10px'
              mx={{ lg: "1rem" }}
              cursor='pointer'>
              <Icon color={textColor} as={IoDocumentsSharp} me='6px' />
              <Text fontSize='xs' color={textColor} fontWeight='bold'>
                TEAMS
              </Text>
            </Flex>
          </Button>
          <Button p='0px' bg='transparent' variant='no-effects'>
            <Flex
              align='center'
              w={{ lg: "135px" }}
              borderRadius='15px'
              justifyContent='center'
              py='10px'
              cursor='pointer'>
              <Icon color={textColor} as={FaPenFancy} me='6px' />
              <Text fontSize='xs' color={textColor} fontWeight='bold'>
                PROJECTS
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>

      <Grid templateColumns={{ sm: "1fr", xl: "repeat(3, 1fr)" }} gap='22px'>
      <Card p='16px'>
  <CardHeader p='12px 5px' mb='12px'>
    <Text fontSize='lg' color={textColor} fontWeight='bold'>
      Profile Picture
    </Text>
  </CardHeader>
  <CardBody px='5px'>
    <Flex direction='column' align='center'>
      {/* 替換為顯示用戶的頭貼 */}
      <Avatar
        src="https://v3-statics.mirrormedia.mg/images/227b88d7-6e89-4bd6-8eb2-4472313f9dfd-w800.webP" // 用戶的頭像來源
        w='120px'
        h='120px'
        borderRadius='full'
        mb='20px'
      />
      {/* 修改頭貼的按鈕 */}
      <Button p='0px' bg='transparent' variant='no-effects'>
        <Flex
          align='center'
          w={{ sm: "100%", lg: "135px" }}
          bg={colorMode === "dark" ? "navy.900" : "#fff"}
          borderRadius='8px'
          justifyContent='center'
          py='10px'
          boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.06)'
          cursor='pointer'
        >
          <Icon color={textColor} as={FaCube} me='6px' />
          <Text fontSize='xs' color={textColor} fontWeight='bold'>
            修改頭貼
          </Text>
        </Flex>
      </Button>
    </Flex>
  </CardBody>
</Card>

<Card p='16px'>
  <CardHeader p='12px 5px' mb='12px'>
    <Text fontSize='lg' color={textColor} fontWeight='bold'>
      Profile name 
    </Text>
  </CardHeader>
  <CardBody px='5px'>
    <Flex direction='column' align='center' justify='center' mt='20px'>
      
      {/* First Name 模擬輸入框 */}
      <Box
        as='div'
        border='1px'
        borderColor='gray.300'
        borderRadius='4px'
        w={{ sm: "100%", lg: "200px" }}
        p='10px'
        mb='10px'
      >
        <Text color='gray.500'>First Name</Text>
      </Box>
      {/* Last Name 模擬輸入框 */}
      <Box
        as='div'
        border='1px'
        borderColor='gray.300'
        borderRadius='4px'
        w={{ sm: "100%", lg: "200px" }}
        p='10px'
        mb='20px'
      >
        <Text color='gray.500'>Last Name</Text>
      </Box>
      {/* 提交修改的按鈕 */}
      <Button p='0px' bg='transparent' variant='no-effects'>
        <Flex
          align='center'
          w={{ sm: "100%", lg: "135px" }}
          bg={colorMode === "dark" ? "navy.900" : "#fff"}
          borderRadius='8px'
          justifyContent='center'
          py='10px'
          boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.06)'
          cursor='pointer'
        >
          <Icon color={textColor} as={IoDocumentsSharp} me='6px' />
          <Text fontSize='xs' color={textColor} fontWeight='bold'>
            提交修改
          </Text>
        </Flex>
      </Button>
    </Flex>
  </CardBody>
</Card>


<Card p='16px'>
  <CardHeader p='12px 5px' mb='12px'>
    <Text fontSize='lg' color={textColor} fontWeight='bold'>
      Account
    </Text>
  </CardHeader>
  <CardBody px='5px'>
    <Flex direction='column' align='center' justify='center' mt='20px'>
      {/* Email 模擬輸入框 */}
      <Box
        as='div'
        border='1px'
        borderColor='gray.300'
        borderRadius='4px'
        w={{ sm: "100%", lg: "300px" }}
        p='10px'
        mb='10px'
      >
        <Text color='gray.500'>Email</Text>
      </Box>
      {/* Password 模擬輸入框 */}
      <Box
        as='div'
        border='1px'
        borderColor='gray.300'
        borderRadius='4px'
        w={{ sm: "100%", lg: "300px" }}
        p='10px'
        mb='20px'
      >
        <Text color='gray.500'>Password</Text>
      </Box>
      {/* 提交按鈕 */}
      <Button p='0px' bg='transparent' variant='no-effects'>
        <Flex
          align='center'
          w={{ sm: "100%", lg: "135px" }}
          bg={colorMode === "dark" ? "navy.900" : "#fff"}
          borderRadius='8px'
          justifyContent='center'
          py='10px'
          boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.06)'
          cursor='pointer'
        >
          <Icon color={textColor} as={FaPenFancy} me='6px' />
          <Text fontSize='xs' color={textColor} fontWeight='bold'>
            提交
          </Text>
        </Flex>
      </Button>
    </Flex>
  </CardBody>
</Card>

      </Grid>
     
    </Flex>
  );
}

export default Profile;
