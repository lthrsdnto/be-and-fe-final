import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLoginUserMutation, User } from "../../services/authApi";

const Login: NextPage = () => {
  const [loginUser, { isSuccess: isLoginSuccess, isLoading: isLoginLoading }] =
    useLoginUserMutation();
  const { register, handleSubmit } = useForm<User>();
  const onSubmit: SubmitHandler<User> = async (data) => {
    await loginUser(data);
  };
  const toast = useToast();

  useEffect(() => {
    if (isLoginSuccess) {
      toast({
        position: "top",
        title: "Login Success.",
        description: "User login successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isLoginSuccess]);

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account ✌️</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {isLoginLoading && <Spinner />}
          <Stack spacing={4} as={"form"} onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="username"
                {...register("username", { required: true })}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register("password", { required: true })}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                type="submit"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
export default Login;
