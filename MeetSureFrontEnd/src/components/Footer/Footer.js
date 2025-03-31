import { Box, Flex, Text, VStack, HStack, Icon } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg="rgba(245, 245, 245, 0.8)" // 非常淺灰 + 高透明度
      borderRadius="xl"
      boxShadow="md"
      maxW="1200px"
      mx="auto"
      my={8}
      px={8}
      py={10}
      backdropFilter="blur(4px)" // 加點霧化效果更有質感（選用）
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        wrap="wrap"
      >
        <VStack align="flex-start" spacing={3} mb={8}>
          <Text fontWeight="bold" color="teal.500">聯絡我們</Text>
          <Text color="teal.500">meetsure0911@gmail.com</Text>
        </VStack>

        <VStack align="flex-start" spacing={3} mb={8}>
          <Text fontWeight="bold" color="teal.500">追蹤我們</Text>
          <HStack spacing={4}>
            <Icon as={FaFacebook} boxSize={6} color="teal.500" />
            <Icon as={FaInstagram} boxSize={6} color="teal.500" />
            <Icon as={FaYoutube} boxSize={6} color="teal.500" />
          </HStack>
        </VStack>
      </Flex>

    </Box>
  );
};

export default Footer;
