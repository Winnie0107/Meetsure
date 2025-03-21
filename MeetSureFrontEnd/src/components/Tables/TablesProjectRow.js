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
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import MeetSureLogo from "assets/img/MeetSureLogo.png"; // ✅ 請根據實際路徑調整

function TablesProjectRow(props) {
  const {
    logo,
    name,
    description,
    budget,
    progression = 0, // 預設值，避免 undefined
    isLast,
    participants = [],
  } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Tr
      onClick={props.onClick}
      cursor="pointer"
      _hover={{ bg: "gray.100" }} // 可選：滑過變色
    >

      <Td width="25%" pl="0px" borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex alignItems="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Image
            src={MeetSureLogo}
            alt="MeetSure Logo"
            width="40px"         // ✅ 寬度
            height="auto"        // ✅ 高度自動等比例
            me="10px"
          />
          <Text fontSize="md" color={titleColor} fontWeight="bold" minWidth="100%">
            {name}
          </Text>
        </Flex>
      </Td>
      <Td width="35%" borderBottom={isLast ? "none" : null} borderColor={borderColor}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {description}
        </Text>
      </Td>
      <Td width="15%" borderBottom={isLast ? "none" : null} borderColor={borderColor}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {budget?.slice(0, 10)}  {/* ✅ 只取前 10 個字元，"YYYY-MM-DD" */}
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
    </Tr>
  );
}

export default TablesProjectRow;
