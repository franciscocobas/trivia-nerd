import { useEffect, useState } from "react";
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";

import { supabase } from "../utils/supabaseClient";

type User = {
  id: string;
  email: string | undefined;
  avatar_url: string;
  full_name: string;
  name: string;
  user_name: string;
};

const Home: NextPage = () => {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    const getUserSession = async () => {
      const userSession = await supabase.auth.session();

      if (userSession && userSession.user) {
        setUser({
          id: userSession.user.id,
          email: userSession.user.email,
          avatar_url: userSession.user.user_metadata.avatar_url,
          full_name: userSession.user.user_metadata.full_name,
          name: userSession.user.user_metadata.name,
          user_name: userSession.user.user_metadata.user_name,
        });
      }
    };

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSession(undefined);
      } else {
        setSession(session);
      }
    });

    getUserSession();
  }, []);
  const signIn = async () => {
    supabase.auth.signIn({
      provider: "github",
    });
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
  };

  return (
    <>
      <Head>
        <title>Trivia Nerd 🤓</title>
      </Head>
      <Center flexDirection="column">
        <Box alignSelf="flex-end" as="header" minH={14}>
          {session && (
            <Button colorScheme="orange" mr={6} mt={4} onClick={signOut}>
              Sign Out
            </Button>
          )}
        </Box>
        <Heading mt={40}>Welcome to Programming Trivia Game</Heading>
        <Text>Before play the game you need to Log In</Text>
        {!session ? (
          <Button leftIcon={<FaGithub />} mt={10} onClick={signIn}>
            Log In with GitHub
          </Button>
        ) : (
          <Button mt={10}>
            <Link href="/game">Start Game</Link>
          </Button>
        )}
      </Center>
    </>
  );
};

export default Home;
