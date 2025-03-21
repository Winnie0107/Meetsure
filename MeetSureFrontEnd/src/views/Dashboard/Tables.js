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
  Spinner,
} from "@chakra-ui/react";
import { FiPlus, FiSearch } from "react-icons/fi";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import React, { useState, useEffect } from "react";
import axios from "axios"; // 🆕 引入 axios
import { useHistory } from "react-router-dom";


function Tables() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const history = useHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState([]); // 🆕 專案列表
  const [loading, setLoading] = useState(true); // 🆕 載入狀態

  // **🚀 獲取專案列表**
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/projects/get/");
        console.log("🔥 API 回應:", response.data);
        setProjects(response.data);
      } catch (error) {
        console.error("❌ 無法獲取專案列表:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const userId = localStorage.getItem("user_id");

  const myProjects = projects.filter((project) =>
    project.members_name?.some((member) => member.user_id === parseInt(userId))
  );

  const filteredProjects = myProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px" minH="650px"  >
        <CardHeader p="6px 0px 22px 16px">
          <Flex justify="space-between" alignItems="center" w="100%">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              專案列表
            </Text>
            <Flex alignItems="center" gap="12px">
              {/* 搜尋框 */}
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
              {/* 新增專案按鈕 */}
              <Button colorScheme="teal" leftIcon={<Icon as={FiPlus} />} size="md">
                新增專案
              </Button>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody p="6px 0px 22px 16px">
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr>
                  <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                    專案名稱
                  </Th>
                  <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                    說明
                  </Th>
                  <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                    建立時間
                  </Th>
                  <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                    參與人員
                  </Th>
                  <Th fontSize="15px" color="gray.400" borderColor={borderColor}>
                    專案進度
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProjects.map((project, index, arr) => {
                  const tasks = project.tasks || [];
                  const totalTasks = tasks.length;
                  const completedTasks = tasks.filter(task => task.completed).length;

                  const progression = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

                  return (
                    <TablesProjectRow
                      key={project.id}
                      name={project.name}
                      logo={project.logo || ""}
                      description={project.description}
                      budget={project.created_at}
                      participants={project.members_name || []}
                      progression={progression} // ✅ 傳入計算好的進度百分比
                      isLast={index === arr.length - 1}
                      onClick={() => history.push(`/admin/projectmanagement/${project.id}`)}
                    />
                  );
                })}
              </Tbody>

            </Table>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Tables;
