import path from "path";
import { promises as fs } from "fs";

import { Button, Center, Heading, List, ListItem, useBoolean } from "@chakra-ui/react";
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import { ANSWER_TYPE, QUESTION_TYPE } from "../types";

const Home: NextPage = ({
  data: questions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [gameStarted, setGameStarted] = useBoolean();
  const [timer, setTimer] = useState<number>(10);
  const interval = useRef<any>();
  const [questionsColorScheme, setQuestionsColorScheme] = useState<{ [id: string]: string }>();
  const [roundEnded, setRoundEnded] = useBoolean();
  const [currentQuestion] = useState<QUESTION_TYPE>(questions[0]);

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
    <Center flexDirection="column" h="100vh">
      {!gameStarted ? (
        <Button onClick={startGame}>Start Game</Button>
      ) : (
        <>
          <Heading mb={10}>{timer}</Heading>
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
        </>
      )}
    </Center>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const questionsDirectory = path.join(process.cwd(), "questions");
  const questionsFileContent = await fs.readFile(
    path.join(questionsDirectory, "questions.json"),
    "utf8",
  );
  const questions: QUESTION_TYPE[] = JSON.parse(questionsFileContent);

  return {
    props: {
      data: questions,
    },
  };
};
