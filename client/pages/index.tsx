import { Box, Button, Center, Flex, Heading, useToast } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { logout } from "../features/authSlice";
import { useAppDispatch } from "../hooks";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    toast({
      position: "top",
      title: "Logout Successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    router.push("/login");
  };
  return (
    <Box w={"full"}>
      <Center>
        <Flex flexDirection={"column"}>
          <Heading fontWeight={"black"} mb={4}>
            DASHBOARD
          </Heading>
          <Button colorScheme="blackAlpha" onClick={() => handleLogout()}>
            Logout
          </Button>
        </Flex>
      </Center>
    </Box>
  );
};

export default Home;
