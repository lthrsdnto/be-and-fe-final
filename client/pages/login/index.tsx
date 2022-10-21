import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/authSlice";
import { useAppDispatch } from "../../hooks";
import { useLoginUserMutation, User } from "../../services/authApi";

const Login: NextPage = () => {
  const [
    loginUser,
    {
      isSuccess: isLoginSuccess,
      isLoading: isLoginLoading,
      isError: isLoginError,
    },
  ] = useLoginUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const onSubmit: SubmitHandler<User> = async (data) => {
    await loginUser(data);
  };
  const toast = useToast();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLoginSuccess) {
      // router.push("/");
      toast({
        position: "top",
        title: "Login Success.",
        description: "User login successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // dispatch(setUser({ token: loginUser.token }));
    }

    if (isLoginError) {
      toast({
        position: "top",
        title: "Login Failed.",
        description: "Wrong username or password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isLoginSuccess, isLoginError]);

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
                {...register("username", {
                  required: true,
                  pattern: /[A-Za-z]{4}/,
                  max: {
                    value: 4,
                    message: "error message",
                  },
                })}
                errorBorderColor="crimson"
              />
              {errors && (
                <FormHelperText>{errors.username?.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                {" "}
                <Input
                  type={show ? "text" : "password"}
                  {...register("password", {
                    required: true,
                    pattern: /[A-Za-z]{4}/,
                    max: {
                      value: 4,
                      message: "error message",
                    },
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
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
