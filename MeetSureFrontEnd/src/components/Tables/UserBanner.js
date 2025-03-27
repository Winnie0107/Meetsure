import React from "react";
import { 
    Avatar, 
    Button, 
    Flex, 
    Text, 
    useColorModeValue, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Input 
  } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

function UserBanner({
    name,
    email,
    img,
    isNameOpen,
    onNameOpen,
    onNameClose,
    newName,
    setNewName,
    handleUpdateName,
    isPasswordOpen,
    onPasswordOpen,
    onPasswordClose,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleUpdatePassword,
    isOpen,  
    handleOpenModal,
    handleCloseModal,
    generatedImg,
    handleGenerateAvatar,
    handleConfirmAvatar,   
  }) {
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue("hsla(0, 0.1%, 100.00%, 0.87)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");

  return (
    <Flex
      direction={{ sm: "column", md: "row" }}
      mb="24px"
      maxH="180px"
      justifyContent={{ sm: "center", md: "space-between" }}
      align="center"
      backdropFilter="blur(21px)"
      boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
      border="1.5px solid"
      borderColor={borderProfileColor}
      bg={bgProfile}
      p="24px"
      borderRadius="20px"
    >
      {/* 左側：使用者頭像與資訊 */}
      <Flex align="center">
        <Avatar src={img?.startsWith("data:image") ? img : `http://localhost:8000/media/${img}`} w="120px" h="120px" borderRadius="full" mb="20px" />
        <Flex direction="column" ml="20px">
          <Text fontSize="23px" fontWeight="bold" color={textColor}>{name || "Name"}</Text>
          <Text fontSize="18px" color="gray.400">{email}</Text>
        </Flex>
      </Flex>

      {/* 右側：按鈕列 */}
      <Flex direction="row" gap="10px">
        <Button leftIcon={<FaEdit />} variant="outline" colorScheme="gray" bg="rgba(45, 187, 189, 0.67)" color="gray.800" onClick={onNameOpen}>
          修改名稱
        </Button>
        <Button leftIcon={<i className="fas fa-key"></i>} variant="outline" colorScheme="gray" bg="rgba(45, 187, 189, 0.67)" color="gray.800" onClick={onPasswordOpen}>
          修改密碼
        </Button>
        <Button leftIcon={<i className="fas fa-user-circle"></i>} variant="outline" colorScheme="gray" bg="rgba(45, 187, 189, 0.67)" color="gray.800" onClick={handleOpenModal}>
          修改頭貼
        </Button>
      </Flex>
      
        {/* AI 頭貼選擇的 Modal 彈窗 */}
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>選擇你的 AI 頭貼</ModalHeader>
            <ModalBody>
              {generatedImg ? (
                <Avatar src={generatedImg} w="150px" h="150px" />
              ) : (
                <Text>點擊「生成頭貼」來試試！</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleGenerateAvatar}>生成頭貼</Button>
              <Button onClick={handleConfirmAvatar} isDisabled={!generatedImg}>確認</Button>

            </ModalFooter>
          </ModalContent>
        </Modal>

      {/* 修改名稱的 Modal */}
      <Modal isOpen={isNameOpen} onClose={onNameClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>修改你的名稱</ModalHeader>
          <ModalBody>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="輸入新名稱" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdateName}>確認修改</Button>
            <Button variant="ghost" onClick={onNameClose}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 修改密碼的 Modal */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>修改密碼</ModalHeader>
          <ModalBody>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="輸入新密碼" mb="3" />
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="確認新密碼" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdatePassword}>提交</Button>
            <Button variant="ghost" onClick={onPasswordClose}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default UserBanner;
