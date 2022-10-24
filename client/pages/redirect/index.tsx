import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Redirect: NextPage = () => {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);
    count === 0 && router.push("/login");
    return () => clearInterval(interval);
  }, [count]);

  return (
    <Box>
      <Heading>Redirecting you in {count} seconds...</Heading>
    </Box>
  );
};
export default Redirect;
