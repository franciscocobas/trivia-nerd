import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Trivia Nerd 🤓</title>
      </Head>
      <Center flexDirection="column">
        <Box alignSelf="flex-end" as="header" minH={14} />
        <Heading mt={40}>Welcome to Programming Trivia Game</Heading>
        <Text>Before play the game you need to Log In</Text>
        <Button
          leftIcon={<FaGithub />}
          mt={10}
          onClick={() => signIn(undefined, { callbackUrl: `${process.env.NEXT_HOST_URL}/game` })}
        >
          Log In with GitHub
        </Button>
      </Center>
    </>
  );
};

export default Home;
