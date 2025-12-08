import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;


export interface Question {
  _id?: string;
  questionType: "Multiple Choice" | "True False" | "Fill in the Blank";
  questionGroup?: "Computer Science" | "Data Science";
  title: string;
  question: string;
  points: number;
  correctAnswer?: string;
  options?: Array<{
    text: string;
    isCorrect?: boolean;
  }>;
  possibleAnswers?: string[];
  published?: boolean;
  quiz?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const fetchQuestionsForQuiz = async (cid: string, qid: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${cid}/quizzes/${qid}/questions`);
  console.log('API response data:', response.data);
  return response.data;
};

export const fetchQuestionById = async (qid: string, questid: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${qid}/questions/${questid}`);
  return response.data;
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createQuestion = async (cid: string, qid: string, question: any) => {
  const response = await axiosWithCredentials.post(`${COURSES_API}/${cid}/quizzes/${qid}/questions`, question);
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateQuestion = async (qid: string, questid: string, updates: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${qid}/questions/${questid}`, updates);
  return response.data;
};

export const deleteQuestion = async (qid: string, questid: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${qid}/questions/${questid}`);
  return response.status === 200;
};