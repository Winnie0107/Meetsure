import React, { useState,useEffect } from "react";
import {
  Box, Flex, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Checkbox,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Divider,VStack,Icon,useToast
} from "@chakra-ui/react";
import axios from "axios"; // ← 確保你已經有這行
import { Search2Icon } from "@chakra-ui/icons";  // 🔥 加這行


const AccountManagement = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);  // 🔁 區分新增或修改
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 搜尋字串
  

  const handleEditClick = (row) => {
    console.log("🔍 點到的 row 是：", row);
    const fixedRow = { ...row, id: row.ID };  


    setSelectedRow(fixedRow);  // ✅ 用 fixedRow，不是原本的 row
    setIsEditMode(true);      // ✅ 設定為編輯模式
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedRow({ account: "", email: "", password: "" });  // ✅ 空表單資料
    setIsEditMode(false);     // ✅ 設定為新增模式
    setModalOpen(true);
    setSearchTerm("");

  };
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 5;
  const fetchCompanyUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/company-users/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log("✅ 成功取得資料", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ 載入公司成員失敗", err.response);
    }
  };
  
  useEffect(() => {
    fetchCompanyUsers(); // ✅ 這樣可以在 useEffect 用
  }, []);
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (isEditMode) {
        console.log("✔️ 編輯保存的資料:", selectedRow);
  
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/users/${selectedRow.id}/update/`,  
          {
            name: selectedRow.name,
            email: selectedRow.email,
            password: selectedRow.password,

          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
  
        console.log("✅ 修改成功：", res.data);
        alert("使用者資料已修改！");
      } else {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/users/create/`,
          {
            name: selectedRow.name,
            email: selectedRow.email,
            password: selectedRow.password,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
  
        console.log("✅ 新增成功：", res.data);
        alert("使用者新增成功！");
      }
  
      // 關閉 modal 並重置表單 & 重新拉資料
      setModalOpen(false);
      setSelectedRow(null);
      setIsEditMode(false);
      await fetchCompanyUsers();  // 🔁 更新顯示列表（你可以拉出去用 useCallback）
    } catch (err) {
      const errorMessage = err.response?.data?.error || "發生未知錯誤，請稍後再試";
      console.error("❌ 操作失敗：", errorMessage);
      alert("操作失敗：" + errorMessage);
    }
  };
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("確定要刪除這位使用者嗎？");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}/delete/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      alert("使用者刪除成功！");
      await fetchCompanyUsers(); // 🔄 重新載入更新後的列表
    } catch (err) {
      console.error("❌ 刪除失敗：", err.response || err);
      alert("刪除失敗，請稍後再試");
    }
  };
  
  const handleInputChange = (field, value) => {
    setSelectedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (e) => {
    setSelectedCount(e.target.checked ? selectedCount + 1 : selectedCount - 1);
  };
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  return (
    <Box display="flex" minH="100vh" bg="#F1F5F9">
      <Box flex="1" p="20px" bg="#F8FAFC">
        <Text fontSize="24px" fontWeight="bold" color="#319795" mb="20px">
          用戶帳號管理
        </Text>

        <Flex mb="20px">
          <Button colorScheme="teal" onClick={handleAddClick}>
            新增使用者
          </Button>
        </Flex>

        <Flex mb="20px" align="center" gap="10px">
        <Input 
  placeholder="請輸入帳號或 Email" 
  size="md" 
  value={isModalOpen ? "" : searchTerm}  // 當 Modal 開啟時，清空搜尋欄位
  onChange={(e) => setSearchTerm(e.target.value)} 
/>

<Button colorScheme="blue" onClick={() => { /* 暫時可以不用特別 onClick，靠輸入即時篩選 */ }}>
  搜尋
</Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="#E2E8F0">
              <Tr>
                <Th><Checkbox onChange={handleCheckboxChange} /></Th>
                <Th>帳號名稱</Th>
                <Th>Email</Th>
                <Th>密碼</Th>
                <Th>操作</Th>
              </Tr>
            </Thead>
            
            <Tbody>
  {currentUsers.length > 0 ? (
    currentUsers.map((row, index) => (
      <Tr key={index}>
        <Td><Checkbox onChange={handleCheckboxChange} /></Td>
        <Td>{row.name}</Td>
        <Td>{row.email}</Td>
        <Td>{row.password || "******"}</Td>
        <Td>
          <Button
            colorScheme="teal"
            size="sm"
            mr="2"
            onClick={() => handleEditClick(row)}
          >
            修改
          </Button>
          <Button
            bg="red.500"
            color="white"
            size="sm"
            _hover={{ bg: "red.600" }}
            onClick={() => handleDelete(row.ID)}
          >
            刪除
          </Button>
        </Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan="5">
        <Flex direction="column" align="center" justify="center" py="20px">
          <Icon as={Search2Icon} boxSize={8} color="gray.400" mb="10px" />
          <Text fontSize="md" color="gray.500">
            找不到符合的使用者資料
          </Text>
        </Flex>
      </Td>
    </Tr>
  )}
</Tbody>


          </Table>
        </Box>

        <Flex justify="space-between" mt="20px">
  <Text>已選取：{selectedCount}</Text>
  <Flex gap="5px">
    <Button
      size="sm"
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      isDisabled={currentPage === 1}
    >
      上一頁
    </Button>

    {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()]
      .slice(0, 3)
      .map(num => (
        <Button
          key={num}
          size="sm"
          onClick={() => setCurrentPage(num + 1)}
          variant={currentPage === num + 1 ? "solid" : "outline"}
        >
          {num + 1}
        </Button>
      ))}

    <Button
      size="sm"
      onClick={() =>
        setCurrentPage(prev =>
          Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage))
        )
      }
      isDisabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
    >
      下一頁
    </Button>
  </Flex>
</Flex>

      </Box>

      {/* 🔽 Modal 區塊：新增與修改共用 */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} isCentered>
  <ModalOverlay />
  <ModalContent borderRadius="12px" maxW="480px" bg="white">
    <ModalHeader
      fontSize="xl"
      fontWeight="bold"
      px="6"
      pt="6"
      pb="3"
      color="gray.700"
    >
      {isEditMode ? "修改使用者資料" : "新增使用者"}
    </ModalHeader>
    <ModalCloseButton mt="14px" mr="12px" />
    <Divider borderColor="gray.200" />

    <ModalBody px="6" pt="3" pb="2">
  {selectedRow && (
    <VStack spacing={5} align="stretch">
      <FormControl>
        <FormLabel color="gray.600" fontSize="sm" mb="1">
          帳號名稱
        </FormLabel>
        <Input
          value={selectedRow.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="請輸入帳號"
        />
      </FormControl>

      <FormControl>
        <FormLabel color="gray.600" fontSize="sm" mb="1">
          Email
        </FormLabel>
        <Input
          value={selectedRow.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="請輸入 Email"
          type="email"
        />
      </FormControl>

      <FormControl>
        <FormLabel color="gray.600" fontSize="sm" mb="1">
          密碼
        </FormLabel>
        <Input
          type="password"
          value={selectedRow.password || ""}
          placeholder={isEditMode ? "請輸入新密碼" : "請輸入密碼"}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
      </FormControl>
    </VStack>
  )}
</ModalBody>

<ModalFooter px="6" pt="4" pb="6">
  <Button
    colorScheme="teal"
    mr={3}
    px="6"
    onClick={handleSave}
    fontWeight="bold"
  >
    保存
  </Button>
  <Button
    variant="outline"
    px="6"
    onClick={() => setModalOpen(false)}
  >
    取消
  </Button>
</ModalFooter>

  </ModalContent>
</Modal>

    </Box>
  );
};

export default AccountManagement;
