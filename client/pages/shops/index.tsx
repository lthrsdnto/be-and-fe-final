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
import { ShopTable } from "../../components/ShopTable";
import {
  Shops,
  useAddShopsMutation,
  useGetShopsQuery,
} from "../../services/shopApi";

const Shop: NextPage = () => {
  const { data: getAllShop, isFetching } = useGetShopsQuery();
  const [addShops, { isSuccess, isLoading }] = useAddShopsMutation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm<Shops>();
  const [active, setActive] = useBoolean(false);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast({
        position: "top",
        title: "Shop created.",
        description: "Shop added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<Shops> = async (data) => {
    await addShops(data);
  };

  return (
    <Box w={"full"}>
      <Box w={"80%"} mx={"auto"}>
        <Flex>
          <Center>
            <Heading m={4} fontWeight={"black"}>
              Shops
            </Heading>
            <Button bg={"green.200"} onClick={onOpen} m={2}>
              Add Shop
            </Button>
            <Spacer />
            {isFetching && <Spinner />}
          </Center>
        </Flex>

        <Flex>
          <Wrap spacing={5}>
            {getAllShop?.map((s, i) => (
              <ShopTable
                data={getAllShop}
                id={s.id}
                name={s.name}
                address={s.address}
                business_type={s.business_type}
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
            <ModalHeader>ADD SHOP</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={3}>
                <Input
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
                <Input
                  placeholder="Address"
                  {...register("address", { required: true })}
                />
                <Input
                  placeholder="Business Type"
                  {...register("business_type", { required: true })}
                />
                <Checkbox
                  {...register("is_active")}
                  onChange={setActive.toggle}
                  isChecked={active}
                >
                  Active Shop?
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

export default Shop;
