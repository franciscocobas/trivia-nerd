import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Trivia Nerd 🤓</title>
      </Head>
      <Center flexDirection="column">
        <Box alignSelf="flex-end" as="header" minH={14} />
        <Heading mt={40}>Welcome to Programming Trivia Game</Heading>
        <Text>Before play the game you need to Sign In</Text>
        {session && (
          <Button colorScheme="green" mt="4">
            <Link href="/game">Play</Link>
          </Button>
        )}
      </Center>
    </>
  );
};

export default Home;
