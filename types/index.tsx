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

export type USER = {
  id: string;
  email: string | undefined;
  avatar_url: string;
  full_name: string;
  name: string;
  user_name: string;
};
