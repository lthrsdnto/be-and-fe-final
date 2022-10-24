import {
  Box,
  Button,
  Flex,
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
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserTable } from "../../components/UserTable";
import {
  useAddUsersMutation,
  useGetUsersQuery,
  Users,
} from "../../services/userApi";

const User: NextPage = () => {
  const { data: allUserData, isFetching } = useGetUsersQuery();
  const [addUser, { isSuccess, isLoading }] = useAddUsersMutation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm<Users>();

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast({
        position: "top",
        title: "Account created.",
        description: "User added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<Users> = async (data) => {
    await addUser(data);
  };

  return (
    <Box w={"full"}>
      <Box w={["90%", "80%", "70%"]} mx={"auto"}>
        <TableContainer
          m={"auto"}
          borderWidth={1}
          borderRadius={"2xl"}
          bgColor={"white"}
        >
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Button bg={"green.200"} onClick={onOpen} m={2}>
              Register
            </Button>
            <Spacer />
            {isFetching && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
                m={2}
              />
            )}
          </Flex>

          <Table variant="simple">
            <Thead bg={"gray.100"} h={16}>
              <Tr>
                <Th>ID</Th>
                <Th>USERNAME</Th>
                <Th></Th>
              </Tr>
            </Thead>

            {allUserData?.map((user, id) => (
              <UserTable
                data={allUserData}
                id={user.id}
                username={user.username}
                password={user.password}
                key={id}
              />
            ))}
          </Table>
        </TableContainer>

        {/* create  */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>ADD USER</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={3}>
                <Input
                  placeholder="Username"
                  {...register("username", { required: true })}
                />
                <Input
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
                <Input
                  placeholder="Confirm Password"
                  {...register("confirmPassword", { required: true })}
                />
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
export default User;
