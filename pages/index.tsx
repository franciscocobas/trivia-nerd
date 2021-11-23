import { useEffect, useRef, useState } from "react";
import { Button, Center, Heading, List, ListItem, useBoolean } from "@chakra-ui/react";
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { ArrowForwardIcon } from "@chakra-ui/icons";

import { ANSWER_TYPE, QUESTION_TYPE } from "../types";

const Home: NextPage = ({
  data: questions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [gameStarted, setGameStarted] = useBoolean();
  const [timer, setTimer] = useState<number>(10);
  const [questionsColorScheme, setQuestionsColorScheme] = useState<{ [id: string]: string }>();
  const [roundEnded, setRoundEnded] = useBoolean();
  const [currentQuestion, setCurrentQuestion] = useState<QUESTION_TYPE>(questions[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const interval = useRef<any>();

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

  const startGame = () => {
    setGameStarted.on();
    interval.current = setInterval(() => {
      setTimer((oTimer) => oTimer - 1);
    }, 1000);
  };

  const checkAnswer = (answer: string) => {
    if (roundEnded) return;
    clearInterval(interval.current);
    setRoundEnded.on();
    if (answer === currentQuestion.correct) {
      setQuestionsColorScheme({ ...questionsColorScheme, [answer]: "green" });
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
        <title>Trivia Nerd 🤓</title>
      </Head>
      <Center flexDirection="column">
        {!gameStarted ? (
          <Button mt={80} onClick={startGame}>
            Start Game
          </Button>
        ) : (
          <>
            <Heading mb={10} mt={40}>
              {timer}
            </Heading>
            <Heading maxW="50%" mb={5} textAlign="center">
              {currentQuestion.question}
            </Heading>
            <List spacing={3}>
              {currentQuestion.answers.map((answer: ANSWER_TYPE) => (
                <ListItem key={answer.id}>
                  <Button
                    _focus={{ boxShadow: "none" }}
                    colorScheme={!questionsColorScheme ? "gray" : questionsColorScheme[answer.id]}
                    cursor={roundEnded ? "default" : "pointer"}
                    w="100%"
                    onClick={() => checkAnswer(answer.id)}
                  >
                    {answer.answer}
                  </Button>
                </ListItem>
              ))}
            </List>
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
          </>
        )}
      </Center>
    </>
  );
};

export default Home;

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
