import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

import { NextPage } from "next";

const Cart: NextPage = () => {
  return (
    <SimpleGrid columns={[2, null, 4]} spacing="10px">
      <Center py={6}>
        <Box
          maxW={"320px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
        >
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            Prodname
          </Heading>
          <Text fontWeight={600} color={"gray.500"} mb={4}></Text>

          <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue("gray.50", "gray.800")}
              fontWeight={"400"}
            >
              prod desc
            </Badge>
          </Stack>

          <Stack mt={8} direction={"row"} spacing={4}>
            <Button
              flex={1}
              fontSize={"sm"}
              rounded={"full"}
              _focus={{
                bg: "gray.200",
              }}
            >
              Remove
            </Button>
            <Button
              flex={1}
              fontSize={"sm"}
              rounded={"full"}
              bg={"yellow.400"}
              color={"white"}
              boxShadow={
                "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
              }
              _hover={{
                bg: "yellow.500",
              }}
              _focus={{
                bg: "red.500",
              }}
            >
              Checkout
            </Button>
          </Stack>
        </Box>
      </Center>
    </SimpleGrid>
  );
};
export default Cart;
