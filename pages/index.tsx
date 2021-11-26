import { Box, Center, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Trivia Nerd 🤓</title>
      </Head>
      <Center flexDirection="column">
        <Box alignSelf="flex-end" as="header" minH={14} />
        <Heading mt={40}>Welcome to Programming Trivia Game</Heading>
        <Text>Before play the game you need to Sign In</Text>
      </Center>
    </>
  );
};

export default Home;
