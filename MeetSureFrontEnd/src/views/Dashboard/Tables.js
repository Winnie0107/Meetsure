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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
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
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // 預設：由新到舊
  const [progressSortOrder, setProgressSortOrder] = useState(null); // null, "asc", "desc"


  // **🚀 獲取專案列表**
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");  // 或你儲存 token 的 key 名稱

      if (!token) {
        console.warn("⚠️ Token 不存在，請重新登入！");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects/get/`, {
          headers: {
            "Authorization": `Token ${token}`  // ✅ 加入 Authorization header
          }
        });

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

  const filteredProjects = myProjects
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .map(project => {
      const tasks = project.tasks || [];
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.completed).length;
      const progression = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
      return { ...project, progression }; // ✅ 將進度加進每個 project
    })
    .sort((a, b) => {
      if (progressSortOrder) {
        return progressSortOrder === "asc"
          ? a.progression - b.progression
          : b.progression - a.progression;
      } else {
        const timeA = new Date(a.created_at);
        const timeB = new Date(b.created_at);
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }
    });



  // **🚀 刪除專案列表**
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/projects/${projectToDelete}/delete/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      // 成功後從畫面移除這個專案
      setProjects(prev => prev.filter(p => p.id !== projectToDelete));
      onClose();
    } catch (error) {
      console.error("❌ 刪除專案失敗:", error.response?.data || error);
      alert("❌ 刪除失敗，請稍後再試！");
    }
  };


  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px" minH="650px"  >
        <CardHeader p="6px 22px 22px 22px">
          <Flex justify="space-between" alignItems="center" w="100%">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              專案列表
            </Text>
            <Flex alignItems="center" gap="12px">
              {/* 搜尋框 */}
              <InputGroup width="300px" borderRadius="full" boxShadow="sm" mr="15px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="搜尋專案名稱或關鍵字..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="md"
                  borderRadius="full" // ✅ 圓角
                  borderColor="gray.300"
                  boxShadow="sm"
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                />
              </InputGroup>

              {/* 新增專案按鈕 */}

            </Flex>
          </Flex>
        </CardHeader>
        <CardBody p="6px  16px 16px 16px">
          {loading ? (
            <Spinner size="lg" />
          ) : filteredProjects.length === 0 ? (
            <Flex
              w="100%"
              h="300px"
              align="center"
              justify="center"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="lg"
              p={8}
            >
              <Flex direction="column" align="center" textAlign="center">
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  目前尚無專案
                </Text>
                <Text fontSize="md" color="gray.500" mb={6}>
                  點擊下方按鈕來建立你的第一個專案，開始你的管理之旅！
                </Text>
                <Button
                  colorScheme="teal"
                  rightIcon={<Icon as={FiPlus} />}
                  onClick={() => history.push("/admin/project")}
                >
                  建立新專案
                </Button>
              </Flex>
            </Flex>
          ) : (

            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr>
                  <Th fontSize="16px" color="gray.400" borderColor={borderColor}>
                    專案名稱
                  </Th>
                  <Th fontSize="16px" color="gray.400" borderColor={borderColor}>
                    說明
                  </Th>
                  <Th
                    fontSize="16px"
                    color="gray.400"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}
                  >
                    建立時間 {sortOrder === "asc" ? "↑" : "↓"}
                  </Th>

                  <Th fontSize="16px" color="gray.400" borderColor={borderColor}>
                    參與人員
                  </Th>
                  <Th
                    fontSize="16px"
                    color="gray.400"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={() => {
                      setProgressSortOrder(prev =>
                        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
                      );
                    }}
                  >
                    專案進度{" "}
                    {progressSortOrder === "asc"
                      ? "↑"
                      : progressSortOrder === "desc"
                        ? "↓"
                        : "-"}
                  </Th>

                  <Th fontSize="16px" color="gray.400" borderColor={borderColor}>
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
                      participants={(project.members_name || []).map(member => ({
                        name: member.name,
                        email: member.email,
                        img: member.img // ❗ 確保從後端已拿到
                      }))}

                      progression={progression} // ✅ 傳入計算好的進度百分比
                      isLast={index === arr.length - 1}
                      onClick={() => history.push(`/admin/projectmanagement/${project.id}`)}
                      onDelete={() => {
                        setProjectToDelete(project.id);
                        onOpen(); // 開啟確認 Modal
                      }}
                    />
                  );
                })}
              </Tbody>

            </Table>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={4} borderRadius="25px">
          <ModalHeader>確認刪除專案 ❌</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>您確定要刪除此專案嗎？</Text>
            <Text mb={2}>這將一併刪除所有相關資料（會議、任務等）</Text>
            <Text>此操作無法復原。</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteProject}>
              確認刪除
            </Button>
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex>
  );
}

export default Tables;
