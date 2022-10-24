import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
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
  useBoolean,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductTable } from "../../components/ProductTable";
import {
  Products,
  useAddProductsMutation,
  useGetProductsQuery,
} from "../../services/productApi";

const Product: NextPage = () => {
  const { data: getAllProduct, isFetching } = useGetProductsQuery();
  const [addProducts, { isSuccess, isLoading, isError }] =
    useAddProductsMutation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm<Products>();
  const [active, setActive] = useBoolean(false);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast({
        position: "top",
        title: "Products created.",
        description: "Products added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    if (isError) {
      toast({
        position: "top",
        title: "Error",
      });
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<Products> = async (data) => {
    await addProducts(data);
  };

  return (
    <Box w={"full"}>
      <Box w={"80%"} mx={"auto"}>
        <Flex>
          <Center>
            <Heading m={4} fontWeight={"black"}>
              Products
            </Heading>
            <Button bg={"green.200"} onClick={onOpen} m={2}>
              Add Product
            </Button>
            <Spacer />
            {isFetching && <Spinner />}
          </Center>
        </Flex>

        <Flex>
          <Wrap spacing={5}>
            {getAllProduct?.map((s, i) => (
              <ProductTable
                data={getAllProduct}
                id={s.id}
                shop_id={s.shop_id}
                product_name={s.product_name}
                price={s.price}
                is_active={s.is_active}
                key={i}
              />
            ))}
          </Wrap>
        </Flex>

        {/* create */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>ADD PRODUCT</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={3}>
                <Input
                  placeholder="Shop ID"
                  {...register("shop_id", { required: true })}
                />
                <Input
                  placeholder="Product Name"
                  {...register("product_name", { required: true })}
                />
                <Input
                  placeholder="Price"
                  {...register("price", { required: true })}
                  type="number"
                />
                <Checkbox
                  {...register("is_active")}
                  onChange={setActive.toggle}
                  isChecked={active}
                >
                  Active Product?
                </Checkbox>
              </VStack>
            </ModalBody>
            <ModalFooter gap={2}>
              {isLoading && <Spinner />}
              <Button colorScheme="teal" variant="outline" type="submit">
                Submit
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default Product;
