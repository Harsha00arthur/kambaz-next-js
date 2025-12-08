import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const fetchQuizzesForCourse = async (cid: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${cid}/quizzes`);
    console.log('API response data:', response.data);
    return response.data;
};

export const fetchQuizById = async (qid: string) => {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${qid}`);
    return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createQuiz = async (cid: string, quiz: any) => {
    const response = await axiosWithCredentials.post(`${COURSES_API}/${cid}/quizzes`, quiz);
    return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateQuiz = async (qid: string, updates: any) => {
    const response = await axiosWithCredentials.put(`${QUIZZES_API}/${qid}`, updates);
    return response.data;
};

export const deleteQuiz = async (qid: string) => {
    const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${qid}`);
    return response.status === 200;
};