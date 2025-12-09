"use client";

import { Button, Card, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as client from "../questionsClient";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";


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


  const deleteQuestion = async (questionId: string) => {
  if (!window.confirm("Delete this question?")) return;

  await client.deleteQuestion(questionId);

  const newQuestions = questions.filter(
    (q) => q._id !== questionId
  );

  setQuestions(newQuestions);
  await recomputeQuizPoints(newQuestions);
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <b>{q.title}</b> — {q.points} pts
            </div>

            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditing(q._id!)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => deleteQuestion(q._id!)}
              >
                Delete
              </Button>
            </div>
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

  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (!quill) return;

    quill.on("text-change", () => {
      setQ((prev) => ({
        ...prev,
        question: quill.root.innerHTML,
      }));
    });

    quill.root.innerHTML = q.question || "";
  }, [quill]);

  return (
    <Card className="p-3 mb-3">

      {/* ✅ TITLE */}
      <Form.Control
        className="mb-2"
        placeholder="Question Title"
        value={q.title}
        onChange={(e) => setQ({ ...q, title: e.target.value })}
      />

      {/* ✅ POINTS */}
      <Form.Control
        type="number"
        className="mb-2"
        placeholder="Points"
        value={q.points}
        onChange={(e) =>
          setQ({ ...q, points: Number(e.target.value) })
        }
      />

      {/* ✅ QUESTION TYPE DROPDOWN */}
      <Form.Select
        className="mb-3"
        value={q.type}
        onChange={(e) =>
          setQ({
            ...q,
            type: e.target.value as "MCQ" | "TRUE_FALSE" | "FILL_BLANK",
          })
        }
      >
        <option value="MCQ">Multiple Choice</option>
        <option value="TRUE_FALSE">True / False</option>
        <option value="FILL_BLANK">Fill in the Blank</option>
      </Form.Select>

      {/* ✅ WYSIWYG QUESTION */}
      <div ref={quillRef} className="mb-3" />

      {/* ✅ MULTIPLE CHOICE */}
      {q.type === "MCQ" && (
        <>
          {q.choices?.map((c, i) => (
            <div key={i} className="d-flex gap-2 mt-2 align-items-center">
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
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => {
                  const copy = [...(q.choices || [])];
                  copy.splice(i, 1);
                  setQ({ ...q, choices: copy });
                }}
              >
                ❌
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            className="mt-2"
            onClick={() =>
              setQ({
                ...q,
                choices: [...(q.choices || []), ""],
              })
            }
          >
            + Add Choice
          </Button>
        </>
      )}

      {/* ✅ TRUE / FALSE */}
      {q.type === "TRUE_FALSE" && (
      <div className="mt-3">
        <Form.Check
          type="radio"
          label="True"
          checked={q.trueFalseAnswer === true}
          onChange={() => setQ({ ...q, trueFalseAnswer: true })}
        />
        <Form.Check
          type="radio"
          label="False"
          checked={q.trueFalseAnswer === false}
          onChange={() => setQ({ ...q, trueFalseAnswer: false })}
        />
      </div>
    )}


      {/* ✅ FILL IN THE BLANK */}
      {q.type === "FILL_BLANK" && (
        <>
          {(q.blanks || []).map((ans: string, i: number) => (
            <div key={i} className="d-flex gap-2 mt-2">
              <Form.Control
                value={ans}
                onChange={(e) => {
                  const copy = [...(q.blanks || [])];
                  copy[i] = e.target.value;
                  setQ({ ...q, blanks: copy });
                }}
              />
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => {
                  const copy = [...(q.blanks || [])];
                  copy.splice(i, 1);
                  setQ({ ...q, blanks: copy });
                }}
              >
                ❌
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            className="mt-2"
            onClick={() =>
              setQ({
                ...q,
                blanks: [...(q.blanks || []), ""],
              })
            }
          >
            + Add Answer
          </Button>
        </>
      )}

      {/* ✅ ACTION BUTTONS */}
      <div className="mt-4 d-flex gap-2">
        <Button onClick={() => onSave(q)}>Save</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>

    </Card>
  );
}
