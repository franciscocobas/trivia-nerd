export type ANSWER_TYPE = {
  id: string;
  answer: string;
};

export type QUESTION_TYPE = {
  id: string;
  question: string;
  answers: ANSWER_TYPE[];
  correct: string;
};
