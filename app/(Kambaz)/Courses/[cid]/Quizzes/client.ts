"use client";

const SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";;

export type Quiz = {
  timeLimit: string;
  _id?: string;
  title: string;
  course: string;

  description?: string;
  points?: number;
  questionsCount?: number;

  availableFromDate?: string;
  availableUntilDate?: string;
  dueDate?: string;

  published?: boolean;
  quizType?: string;
  score?: number;
};

// Generic fetch wrapper
async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  return (await res.json()) as T;
}

/* ────────────────────────────────────────────
   FETCH QUIZZES
────────────────────────────────────────────── */
export async function fetchQuizzesByCourse(cid: string): Promise<Quiz[]> {
  return jsonFetch<Quiz[]>(`${SERVER}/api/courses/${cid}/quizzes`);
}

export async function fetchQuizById(qid: string): Promise<Quiz> {
  return jsonFetch<Quiz>(`${SERVER}/api/quizzes/${qid}`);
}

/* ────────────────────────────────────────────
   CREATE QUIZ
────────────────────────────────────────────── */
export async function createQuiz(
  cid: string,
  quiz: Partial<Quiz>
): Promise<Quiz> {
  return jsonFetch<Quiz>(`${SERVER}/api/courses/${cid}/quizzes`, {
    method: "POST",
    body: JSON.stringify(quiz),
  });
}

/* ────────────────────────────────────────────
   UPDATE QUIZ  ⭐ THIS IS THE ONE THAT WAS BROKEN
────────────────────────────────────────────── */
export async function updateQuiz(
  quiz: Partial<Quiz> & { _id: string }
): Promise<Quiz> {
  return jsonFetch<Quiz>(`${SERVER}/api/quizzes/${quiz._id}`, {
    method: "PUT",
    body: JSON.stringify(quiz),
  });
}

/* ────────────────────────────────────────────
   DELETE QUIZ
────────────────────────────────────────────── */
export async function deleteQuiz(qid: string): Promise<void> {
  await jsonFetch(`${SERVER}/api/quizzes/${qid}`, {
    method: "DELETE",
  });
}

/* ────────────────────────────────────────────
   PUBLISH / UNPUBLISH
────────────────────────────────────────────── */
export async function togglePublish(
  qid: string,
  published: boolean
): Promise<Quiz> {
  return jsonFetch<Quiz>(`${SERVER}/api/quizzes/${qid}/publish`, {
    method: "PUT",
    body: JSON.stringify({ published }),
  });
}
