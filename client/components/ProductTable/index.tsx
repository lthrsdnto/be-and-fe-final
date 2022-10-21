import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  Products,
  useAddCartsMutation,
  useDeleteProductsMutation,
  useUpdateProductsMutation,
} from "../../services/productApi";

export const ProductTable: React.FC<any> = ({
  id,
  shop_id,
  product_name,
  price,
  is_active,
  data,
}) => {
  const [
    deleteProduct,
    {
      isSuccess: isDeleteSuccess,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
    },
  ] = useDeleteProductsMutation();
  const [
    updateProduct,
    {
      isSuccess: isUpdateSuccess,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
    },
  ] = useUpdateProductsMutation();

  const [
    addCart,
    {
      isSuccess: isCartSuccess,
      isLoading: isCartLoading,
      isError: isCartError,
    },
  ] = useAddCartsMutation();

  const isDelete = useDisclosure();
  const isUpdate = useDisclosure();
  const deleteForm = useForm<Products>();
  const updateForm = useForm<Products>();
  let toast = useToast();

  const onDelete: SubmitHandler<Products> = async () => {
    await deleteProduct(id);
  };

  const onUpdate: SubmitHandler<Products> = async (data) => {
    await updateProduct(data);
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      isUpdate.onClose();
      toast({
        position: "top",
        title: "Product Updated.",
        description: "Product updated successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }

    if (isDeleteSuccess) {
      isDelete.onClose();
      toast({
        position: "top",
        title: "Product Deleted.",
        description: "Product deleted successfully.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isUpdateSuccess, isDeleteSuccess]);
  const [flag, setFlag] = useBoolean(false);

  const addToCart = () => {
    console.log(id);
  };

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
          <Text
            color={"blue.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"xs"}
            letterSpacing={1.1}
          >
            Shop ID : {shop_id}
          </Text>
          <Heading
            color={useColorModeValue("gray.700", "white")}
            fontSize={"2xl"}
            fontFamily={"body"}
          >
            {product_name}
          </Heading>
          <Flex>
            <Text color={"gray.500"}>{price}</Text>
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
              |
              <AddIcon
                onClick={addToCart}
                w={5}
                h={5}
                cursor={"pointer"}
                textColor={"blue.400"}
                mx={"2"}
              />
            </Center>
          </Flex>

          <Text>{is_active}</Text>
        </Stack>
      </Box>

      {/* update */}
      <Modal isOpen={isUpdate.isOpen} onClose={isUpdate.onClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={updateForm.handleSubmit(onUpdate)}>
          <ModalHeader>UPDATE PRODUCT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input
                type="hidden"
                value={id}
                {...updateForm.register("id", { required: true })}
              />

              <Input
                placeholder="Product Name"
                {...updateForm.register("product_name", { required: true })}
              />
              <Input
                placeholder="Price"
                {...updateForm.register("price", { required: true })}
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
          <ModalHeader>DELETE PRODUCT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Text>
                <Badge colorScheme="red">"{product_name}"</Badge> delete this
                product?
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
