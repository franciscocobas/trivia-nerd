// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { QUESTION_TYPE } from "../../types";

type Data = QUESTION_TYPE[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const questions = [
    {
      id: "ABCDEF",
      question: "¿Qué lenguaje de programación se creó primero?",
      answers: [
        {
          id: "XYZ",
          answer: "Javascript",
        },
        {
          id: "ABC",
          answer: "PHP",
        },
        {
          id: "DEF",
          answer: "Java",
        },
        {
          id: "GHI",
          answer: "Python",
        },
      ],
      correct: "DEF",
    },
  ];

  res.status(200).json(questions);
}
