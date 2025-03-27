import React from "react";
import {
  Tr,
  Td,
  Flex,
  Text,
  Progress,
  Icon,
  Avatar,
  AvatarGroup,
  useColorModeValue,
  Image,
  Button,
} from "@chakra-ui/react";
import MeetSureLogo from "assets/img/MeetSureLogo.png";
import { HiOutlineTrash } from "react-icons/hi";



function TablesProjectRow(props) {
  const {
    logo,
    name,
    description,
    budget,
    progression = 0,
    isLast,
    participants = [],
    onClick,
    onDelete, // ✅ 新增刪除事件處理
  } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Tr
      onClick={onClick}
      cursor="pointer"
      _hover={{ bg: "gray.100" }}
    >
      <Td width="25%" pl="0px" borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex alignItems="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Image
            src={MeetSureLogo}
            alt="MeetSure Logo"
            width="40px"
            height="auto"
            me="10px"
          />
          <Text fontSize="md" color={titleColor} fontWeight="bold" minWidth="100%">
            {name}
          </Text>
        </Flex>
      </Td>

      <Td width="35%" borderBottom={isLast ? "none" : null} borderColor={borderColor}>
        <Text
          fontSize="md"
          color={textColor}
          fontWeight="bold"
          pb=".5rem"
        >
          {description?.length > 46 ? `${description.slice(0, 46)}...` : description}
        </Text>
      </Td>


      <Td width="15%" borderBottom={isLast ? "none" : null} borderColor={borderColor}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {budget?.slice(0, 10)}
        </Text>
      </Td>

      <Td width="10%" borderBottom={isLast ? "none" : null} borderColor={borderColor}>
        <AvatarGroup size="sm" max={3}>
          {participants.map((participant, index) => (
            <Avatar key={index} name={participant.name} />
          ))}
        </AvatarGroup>
      </Td>

      <Td width="15%" borderBottom={isLast ? "none" : null} borderColor={borderColor}>
        <Flex direction="column">
          <Text fontSize="md" color="teal.500" fontWeight="bold" pb=".2rem">
            {`${progression}%`}
          </Text>
          <Progress colorScheme="teal" size="xs" value={progression} borderRadius="15px" />
        </Flex>
      </Td>

      {/* ✅ 新增刪除按鈕區塊 */}
      <Td width="5%" borderBottom={isLast ? "none" : null} borderColor={borderColor}>
        <Button
          size="md"
          colorScheme="red"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation(); // ❗️避免觸發 row 的 onClick
            if (onDelete) onDelete();
          }}
        >
          <Icon as={HiOutlineTrash} boxSize={6} />
        </Button>
      </Td>
    </Tr>
  );
}

export default TablesProjectRow;
