"use client";

import { Button, Card, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as client from "../questionsClient";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function QuestionsTab({ qid }: { qid: string }) {
  const [questions, setQuestions] = useState<client.Question[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  // ✅ MUST LIVE INSIDE COMPONENT (qid is in scope here)
  const recomputeQuizPoints = async (
    updatedQuestions: client.Question[]
  ) => {
    const totalPoints = updatedQuestions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );

    await fetch(
      `${process.env.NEXT_PUBLIC_HTTP_SERVER}/api/quizzes/${qid}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: totalPoints }),
      }
    );
  };

  const load = async () => {
    const data = await client.fetchQuestions(qid);
    setQuestions(data);
    await recomputeQuizPoints(data); // ✅ now works
  };

  useEffect(() => {
    load();
  }, []);

  const addQuestion = async () => {
    const q = await client.createQuestion(qid, {
      type: "MCQ",
      title: "New Question",
      points: 1,
      question: "",
      choices: ["Choice 1", "Choice 2"],
      correctChoice: 0,
    });

    const newQuestions = [...questions, q];
    setQuestions(newQuestions);
    await recomputeQuizPoints(newQuestions); // ✅ now works
    setEditing(q._id!);
  };

  return (
    <div>
      <Button onClick={addQuestion} className="mb-3">
        + New Question
      </Button>

      {questions.map((q) =>
        editing === q._id ? (
          <QuestionEditor
            key={q._id}
            question={q}
            onSave={async (updated) => {
              const saved = await client.updateQuestion(updated);

              const newQuestions = questions.map((x) =>
                x._id === saved._id ? saved : x
              );

              setQuestions(newQuestions);
              await recomputeQuizPoints(newQuestions); // ✅ now works
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <Card key={q._id} className="mb-2 p-3">
            <div className="d-flex justify-content-between">
              <div>
                <b>{q.title}</b> — {q.points} pts
              </div>
              <Button size="sm" onClick={() => setEditing(q._id!)}>
                Edit
              </Button>
            </div>
          </Card>
        )
      )}
    </div>
  );
}

function QuestionEditor({
  question,
  onSave,
  onCancel,
}: {
  question: client.Question;
  onSave: (q: client.Question) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState(question);

  return (
    <Card className="p-3 mb-3">
      <Form.Control
        className="mb-2"
        value={q.title}
        onChange={(e) => setQ({ ...q, title: e.target.value })}
      />

      <ReactQuill
        value={q.question}
        onChange={(v) => setQ({ ...q, question: v })}
      />

      {q.type === "MCQ" && (
        <>
          {q.choices?.map((c, i) => (
            <div key={i} className="d-flex gap-2 mt-2">
              <Form.Check
                type="radio"
                checked={q.correctChoice === i}
                onChange={() =>
                  setQ({ ...q, correctChoice: i })
                }
              />
              <Form.Control
                value={c}
                onChange={(e) => {
                  const copy = [...(q.choices || [])];
                  copy[i] = e.target.value;
                  setQ({ ...q, choices: copy });
                }}
              />
            </div>
          ))}
        </>
      )}

      <div className="mt-3 d-flex gap-2">
        <Button onClick={() => onSave(q)}>Save</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}
