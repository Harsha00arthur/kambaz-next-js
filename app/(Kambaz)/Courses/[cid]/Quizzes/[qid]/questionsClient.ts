const SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export type Question = {
  _id?: string;
  quiz: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_BLANK";
  title: string;
  points: number;
  question: string;

  choices?: string[];
  correctChoice?: number;
  trueFalseAnswer?: boolean;
  blanks?: string[];
};

export const fetchQuestions = async (qid: string) =>
  (await fetch(`${SERVER}/api/quizzes/${qid}/questions`)).json();

export const createQuestion = async (qid: string, question: Partial<Question>) =>
  (await fetch(`${SERVER}/api/quizzes/${qid}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  })).json();

export const updateQuestion = async (question: Question) =>
  (await fetch(`${SERVER}/api/questions/${question._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  })).json();

export const deleteQuestion = async (id: string) =>
  fetch(`${SERVER}/api/questions/${id}`, { method: "DELETE" });
