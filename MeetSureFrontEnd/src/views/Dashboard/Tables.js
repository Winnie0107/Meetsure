// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  Icon,
  useColorModeValue,
  Avatar,
  AvatarGroup
} from "@chakra-ui/react";
// React icons import for the plus icon
import { FiPlus } from "react-icons/fi";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";  // 確保這裡導入的是 TablesProjectRow
import React from "react";
import { tablesProjectData, tablesTableData } from "variables/general";
// dayjs 用來處理日期格式
import dayjs from "dayjs";

function Tables() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {/* 第一個卡片，顯示專案資料表 */}
      <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 16px">
          <Flex justify="space-between" alignItems="center">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              用戶媒體庫
            </Text>
            {/* +號按鈕 */}
            <Button colorScheme="teal" leftIcon={<Icon as={FiPlus} />}>
              新增檔案
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px">
                <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                  專案名稱
                </Th>
                <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                  開會日期
                </Th>
                <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                  AI分析狀況
                </Th>
                <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                  Completion
                </Th>
                <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                  參與人員
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {tablesProjectData.map((row, index, arr) => {
                // 這裡傳遞每個專案的參與者資料
                const participants = [
                  { name: "Ryan Florence", src: "avatar1" },
                  { name: "Segun Adebayo", src: "avatar2" },
                  { name: "Kent Dodds", src: "avatar3" },
                ];

                return (
                  <TablesProjectRow
                    name={row.name}
                    logo={row.logo}
                    status={row.status}
                    budget={row.budget}
                    progression={row.progression}
                    isLast={index === arr.length - 1 ? true : false}
                    participants={row.participants} // 傳遞參與者資料
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* 另一個表格展示 Authors */}
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Authors Table
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Author
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Function
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Employed
                </Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {tablesTableData.map((row, index, arr) => {
                return (
                  <TablesProjectRow
                    name={row.name}
                    logo={row.logo}
                    email={row.email}
                    subdomain={row.subdomain}
                    domain={row.domain}
                    status={row.status}
                    date={row.date}
                    isLast={index === arr.length - 1 ? true : false}
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Tables;
