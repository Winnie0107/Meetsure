import React, { useState } from "react";
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
  Input,
  FormControl
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import getAvatarUrl from "components/Icons/getAvatarUrl";

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
  const [characterInput, setCharacterInput] = useState("");
  const [styleInput, setStyleInput] = useState("");
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
        <Avatar
          src={getAvatarUrl(img)}
          w="120px"
          h="120px"
          borderRadius="full"
          mb="20px"
        />

        <Flex direction="column" ml="20px">
          <Text fontSize="23px" fontWeight="bold" color={textColor}>{name || "Name"}</Text>
          <Text fontSize="18px" color="gray.400">{email}</Text>
        </Flex>
      </Flex>

      {/* 右側：按鈕列 */}
      <Flex direction="row" gap="10px">
        <Button leftIcon={<FaEdit />} variant="outline" colorScheme="gray" bg="teal.500" color="white" onClick={onNameOpen}>
          修改名稱
        </Button>
        <Button leftIcon={<i className="fas fa-key"></i>} variant="outline" colorScheme="gray" bg="teal.500" color="white" onClick={onPasswordOpen}>
          修改密碼
        </Button>
        <Button leftIcon={<i className="fas fa-user-circle"></i>} variant="outline" colorScheme="gray" bg="teal.500" color="white" onClick={handleOpenModal}>
          修改頭貼
        </Button>
      </Flex>

      {/* AI 頭貼選擇的 Modal 彈窗 */}
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent
          maxW="500px"
          maxH="90vh"
          overflow="auto"
          display="flex"
          flexDirection="column"
        >
          <ModalHeader>選擇你的 AI 頭貼</ModalHeader>
          <ModalBody flex="1" overflowY="auto">
            <FormControl mb={3}>
              <Text fontWeight="bold" mb={1}>角色</Text>
              <Input
                placeholder="girl, boy, animal"
                value={characterInput}
                onChange={(e) => setCharacterInput(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <Text fontWeight="bold" mb={1}>風格</Text>
              <Input
                placeholder="cute, carton, vintage"
                value={styleInput}
                onChange={(e) => setStyleInput(e.target.value)}
              />
            </FormControl>


            {generatedImg ? (
              <Avatar src={generatedImg} w="150px" h="150px" mx="auto" />
            ) : (
              <Text textAlign="center">點擊「生成頭貼」來試試！</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleGenerateAvatar}>生成頭貼</Button>
            <Button onClick={handleConfirmAvatar} isDisabled={!generatedImg}>確認</Button>
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
