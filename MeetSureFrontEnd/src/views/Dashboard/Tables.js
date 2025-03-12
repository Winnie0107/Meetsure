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
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FiPlus, FiSearch } from "react-icons/fi";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import React, { useState } from "react";
import { tablesProjectData, tablesTableData } from "variables/general";

function Tables() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [searchQuery, setSearchQuery] = useState("");

  // 過濾後的專案資料
  const filteredProjects = tablesProjectData.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.status && row.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 16px">
          <Flex justify="space-between" alignItems="center" w="100%">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              用戶媒體庫
            </Text>
            <Flex alignItems="center" gap="12px">
              {/* 搜尋框，設定固定寬度，不影響 +按鈕 */}
              <InputGroup width="240px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="搜尋專案名稱或關鍵字..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="sm"
                  borderColor="gray.300"
                  _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                />
              </InputGroup>
              {/* 新增檔案按鈕 保持原來的大小和樣式 */}
              <Button colorScheme="teal" leftIcon={<Icon as={FiPlus} />} size="md">
                新增檔案
              </Button>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr>
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
              {filteredProjects.map((row, index, arr) => (
                <TablesProjectRow
                  name={row.name}
                  logo={row.logo}
                  status={row.status}
                  budget={row.budget}
                  progression={row.progression}
                  participants={row.participants}
                  isLast={index === arr.length - 1}
                  key={index}
                />
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Authors Table  */}
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
              {tablesTableData.map((row, index, arr) => (
                <TablesProjectRow
                  name={row.name}
                  logo={row.logo}
                  email={row.email}
                  subdomain={row.subdomain}
                  domain={row.domain}
                  status={row.status}
                  date={row.date}
                  isLast={index === arr.length - 1}
                  key={index}
                />
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Tables;