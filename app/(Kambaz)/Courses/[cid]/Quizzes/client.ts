"use client";

const SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

export type Quiz = {
  _id?: string;
  title: string;
  course: string;

  description?: string;
  quizType?: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  points?: number;

  availableFromDate?: string;
  availableUntilDate?: string;
  dueDate?: string;

  published?: boolean;
  questionsCount?: number;

  // Optional: last score for current student
  score?: number;
};

const courseQuizzesUrl = (cid: string) => `${SERVER}/api/courses/${cid}/quizzes`;
const quizUrl = (qid: string) => `${SERVER}/api/quizzes/${qid}`;

// GET /api/courses/:cid/quizzes
export async function fetchQuizzesByCourse(cid: string): Promise<Quiz[]> {
  const res = await fetch(courseQuizzesUrl(cid), { cache: "no-store" });
  if (!res.ok) throw new Error("Error fetching quizzes");
  return res.json();
}

// POST /api/courses/:cid/quizzes
export async function createQuiz(cid: string, quiz: Partial<Quiz>): Promise<Quiz> {
  const res = await fetch(courseQuizzesUrl(cid), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });
  if (!res.ok) throw new Error("Error creating quiz");
  return res.json();
}

// GET /api/quizzes/:qid
export async function fetchQuizById(qid: string): Promise<Quiz> {
  const res = await fetch(quizUrl(qid), { cache: "no-store" });
  if (!res.ok) throw new Error("Error fetching quiz");
  return res.json();
}

// PUT /api/quizzes/:qid
export async function updateQuiz(quiz: Quiz): Promise<Quiz> {
  if (!quiz._id) throw new Error("Quiz _id is required for update");
  const res = await fetch(quizUrl(quiz._id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });
  if (!res.ok) throw new Error("Error updating quiz");
  return res.json();
}

// DELETE /api/quizzes/:qid
export async function deleteQuiz(qid: string): Promise<void> {
  const res = await fetch(quizUrl(qid), {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting quiz");
}

// PATCH publish / unpublish helper
export async function togglePublish(qid: string, published: boolean): Promise<Quiz> {
  const res = await fetch(`${quizUrl(qid)}/publish`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ published }),
  });
  if (!res.ok) throw new Error("Error toggling publish");
  return res.json();
}
