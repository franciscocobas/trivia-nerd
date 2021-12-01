import { ArrowForwardIcon } from "@chakra-ui/icons";
import Head from "next/head";
import {
  Button,
  Center,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { ANSWER_TYPE, QUESTION_TYPE } from "../types";

function GamePage({
  data: questions,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [timer, setTimer] = useState<number>(10);
  const [questionsColorScheme, setQuestionsColorScheme] = useState<{ [id: string]: string }>();
  const [roundEnded, setRoundEnded] = useBoolean();
  const [currentQuestion, setCurrentQuestion] = useState<QUESTION_TYPE>(questions[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const interval = useRef<any>();
  const { status } = useSession();
  const [answersCounter, setAnswersCounter] = useState<number>(0);

  useEffect(() => {
    setQuestionsColorScheme(
      currentQuestion.answers.reduce(
        (acc: { [id: string]: string }, curr: { [key: string]: string }) => {
          acc[curr.id] = "gray";

          return acc;
        },
        {},
      ),
    );
    interval.current = setInterval(() => {
      setTimer((oTimer) => oTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (timer < 1) {
      setRoundEnded.on();
      clearInterval(interval.current);
      setQuestionsColorScheme({ ...questionsColorScheme, [currentQuestion.correct]: "green" });
    }
  }, [timer]);

  if (status !== "authenticated") {
    return <Text textAlign="center">Log in in order to play the game</Text>;
  }

  const goToNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setCurrentQuestion(questions[currentIndex + 1]);
    setTimer(10);
    interval.current = setInterval(() => {
      setTimer((oTimer) => oTimer - 1);
    }, 1000);
    setRoundEnded.off();
  };

  const checkAnswer = (answer: string) => {
    if (roundEnded) return;
    clearInterval(interval.current);
    setRoundEnded.on();
    if (answer === currentQuestion.correct) {
      setQuestionsColorScheme({ ...questionsColorScheme, [answer]: "green" });
      setAnswersCounter((prev) => prev + 1);
    } else {
      setQuestionsColorScheme({
        ...questionsColorScheme,
        [answer]: "red",
        [currentQuestion.correct]: "green",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Play trivia Nerd 🤓</title>
      </Head>

      <Container maxW="container.xl">
        <Heading mb={10} mt={30} textAlign="center">
          {timer}
        </Heading>
        <Heading mb={5} textAlign="center">
          {currentQuestion.question}
        </Heading>
        <List maxW={["100%", "30%"]} mx="auto" spacing={3}>
          {currentQuestion.answers.map((answer: ANSWER_TYPE) => (
            <ListItem key={answer.id}>
              <Button
                _focus={{ boxShadow: "none" }}
                colorScheme={!questionsColorScheme ? "gray" : questionsColorScheme[answer.id]}
                cursor={roundEnded ? "default" : "pointer"}
                h="auto"
                py="3"
                w="100%"
                whiteSpace="normal"
                onClick={() => checkAnswer(answer.id)}
              >
                {answer.answer}
              </Button>
            </ListItem>
          ))}
        </List>
        <Center minH={20}>
          {roundEnded && (
            <Button
              colorScheme="blue"
              mt={8}
              rightIcon={<ArrowForwardIcon />}
              onClick={goToNextQuestion}
            >
              Next Question
            </Button>
          )}
        </Center>
        <Center mt={5}>
          <Text>{answersCounter} / 10</Text>
        </Center>
      </Container>
    </>
  );
}

export default GamePage;

export const getServerSideProps: GetServerSideProps = async () => {
  if (!process.env.AWS_QUESTIONS_URL) return { props: {} };
  const response = await fetch(process.env.AWS_QUESTIONS_URL);
  const questions: QUESTION_TYPE[] = await response.json();

  return {
    props: {
      data: questions,
    },
  };
};
