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
import { useCreateUserMutation, User } from "../services/authApi";

const Signup: NextPage = () => {
  const [
    signupUser,
    {
      isSuccess: isSignupSuccess,
      isLoading: isSignupLoading,
      isError: isSignupError,
    },
  ] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const response: any = await signupUser(data);
      if (isSignupError) {
        toast({
          position: "top",
          title: response.error.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toast = useToast();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  useEffect(() => {
    if (isSignupSuccess) {
      router.push("/login");
      toast({
        position: "top",
        title: "Signup Success.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isSignupSuccess]);

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign up account ✌️</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {isSignupLoading && <Spinner />}
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
            <FormControl id="confirmPassword">
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                {" "}
                <Input
                  type={show ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    pattern: /[A-Za-z]{4}/,
                    max: {
                      value: 4,
                      message: "error message",
                    },
                  })}
                />
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

export default Signup;
