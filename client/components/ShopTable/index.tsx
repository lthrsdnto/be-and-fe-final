import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Stack,
  Text,
  useBoolean,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Shops,
  useActivateShopsMutation,
  useDeleteShopsMutation,
  useUpdateShopsMutation,
} from "../../services/shopApi";

export const ShopTable: React.FC<any> = ({
  id,
  name,
  address,
  business_type,
  is_active,
  data,
}) => {
  const [
    deleteShop,
    { isSuccess: isDeleteSuccess, isLoading: isDeleteLoading },
  ] = useDeleteShopsMutation();
  const [
    updateShop,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateShopsMutation();
  const [
    activateShop,
    { isSuccess: isStatusSuccess, isLoading: isStatusLoading },
  ] = useActivateShopsMutation();

  const isDelete = useDisclosure();
  const isUpdate = useDisclosure();
  const isActive = useDisclosure();
  const deleteForm = useForm<Shops>();
  const updateForm = useForm<Shops>();
  const statusForm = useForm<Shops>();
  let toast = useToast();

  const onDelete: SubmitHandler<Shops> = async () => {
    await deleteShop(id);
  };

  const onUpdate: SubmitHandler<Shops> = async (data) => {
    await updateShop(data);
  };

  const onActive: SubmitHandler<Shops> = async (data) => {
    await activateShop(data);
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      isUpdate.onClose();
      toast({
        position: "top",
        title: "Shop Updated.",
        description: "Shop updated successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }

    if (isDeleteSuccess) {
      isDelete.onClose();
      toast({
        position: "top",
        title: "Shop Deleted.",
        description: "Shop deleted successfully.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isUpdateSuccess, isDeleteSuccess]);
  const [flag, setFlag] = useBoolean(false);
  const [active, setActive] = useBoolean(false);

  return (
    <>
      <Box
        maxW={"380px"}
        h={"full"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"md"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        mx={"auto"}
      >
        <Box h={"full"} bg={"gray.100"} mt={-6} mx={-6} mb={6} pos={"relative"}>
          <Image
            src={"https://source.unsplash.com/random/?city,night/300x300/"}
            w={"full"}
            h={"250px"}
            objectFit={"cover"}
            objectPosition="center"
          />
        </Box>
        <Stack>
          {is_active ? (
            <>
              <Text
                color={"green.500"}
                textTransform={"uppercase"}
                fontWeight={800}
                fontSize={"sm"}
                letterSpacing={1.1}
              >
                {business_type}
              </Text>
              <Flex>
                <Heading
                  color={useColorModeValue("gray.700", "white")}
                  fontSize={"2xl"}
                  fontFamily={"body"}
                >
                  {name}
                </Heading>
                <Spacer />
                <Center>
                  <Text color={"blue.500"} fontSize={10} fontWeight={"bold"}>
                    Shop ID: {id}
                  </Text>
                </Center>
              </Flex>
              <Flex>
                <Text color={"gray.500"}>{address}</Text>

                <Spacer />
                <Center>
                  <EditIcon
                    onClick={isUpdate.onOpen}
                    w={5}
                    h={5}
                    cursor={"pointer"}
                    textColor={"green.400"}
                    mx={"2"}
                  />
                  |
                  <DeleteIcon
                    onClick={isDelete.onOpen}
                    w={5}
                    h={5}
                    cursor={"pointer"}
                    textColor={"red.400"}
                    mx={"2"}
                  />
                </Center>
              </Flex>
            </>
          ) : (
            <Box w={"full"} h={"full"} style={{ filter: "blur(3px)" }}>
              <>
                <Text
                  color={"green.500"}
                  textTransform={"uppercase"}
                  fontWeight={800}
                  fontSize={"sm"}
                  letterSpacing={1.1}
                >
                  {business_type}
                </Text>
                <Flex>
                  <Heading
                    color={useColorModeValue("gray.700", "white")}
                    fontSize={"2xl"}
                    fontFamily={"body"}
                  >
                    {name}
                  </Heading>
                  <Spacer />

                  <Center>
                    <Text color={"blue.500"} fontSize={10} fontWeight={"bold"}>
                      Shop ID: {id}
                    </Text>
                  </Center>
                </Flex>
                <Flex>
                  <Text color={"gray.500"}>{address}</Text>

                  <Spacer />
                  <Center>
                    <EditIcon
                      onClick={isActive.onOpen}
                      w={5}
                      h={5}
                      cursor={"pointer"}
                      textColor={"green.400"}
                      mx={"2"}
                    />
                    |
                    <DeleteIcon
                      w={5}
                      h={5}
                      cursor={"pointer"}
                      textColor={"red.400"}
                      mx={"2"}
                    />
                  </Center>
                </Flex>
              </>
            </Box>
          )}
        </Stack>
      </Box>
      {/* change status */}
      <Modal isOpen={isActive.isOpen} onClose={isActive.onClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={statusForm.handleSubmit(onActive)}>
          <ModalHeader>UPDATE SHOP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input
                type="hidden"
                value={id}
                {...statusForm.register("id", { required: true })}
              />
              <Checkbox
                {...statusForm.register("is_active")}
                onChange={setActive.toggle}
                isChecked={active}
              >
                Active Shop?
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            {isStatusLoading && <Spinner />}
            <Button bg={"green.200"} type="submit">
              Submit
            </Button>

            <Button onClick={isActive.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* update */}
      <Modal isOpen={isUpdate.isOpen} onClose={isUpdate.onClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={updateForm.handleSubmit(onUpdate)}>
          <ModalHeader>UPDATE SHOP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input
                type="hidden"
                value={id}
                {...updateForm.register("id", { required: true })}
              />
              <Input
                placeholder="Name"
                {...updateForm.register("name", { required: true })}
              />
              <Input
                placeholder="Address"
                {...updateForm.register("address", { required: true })}
              />
              <Input
                placeholder="Business Type"
                {...updateForm.register("business_type", { required: true })}
              />
              <Checkbox
                {...updateForm.register("is_active")}
                onChange={setFlag.toggle}
                isChecked={flag}
              >
                Active Shop?
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            {isUpdateLoading && <Spinner />}
            <Button bg={"green.200"} type="submit">
              Submit
            </Button>

            <Button onClick={isUpdate.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* delete */}
      <Modal isOpen={isDelete.isOpen} onClose={isDelete.onClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={deleteForm.handleSubmit(onDelete)}>
          <ModalHeader>DELETE SHOP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Text>
                <Badge colorScheme="red">"{name}"</Badge> delete this shop?
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            {isDeleteLoading && <Spinner />}
            <Button bg={"orange.100"} type="submit">
              Confirm
            </Button>
            <Button onClick={isDelete.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
