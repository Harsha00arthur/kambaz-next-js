"use client";

import { Button, Card, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

import * as questionClient from "../questionsClient";
import * as quizClient from "../../client";
import { updateQuiz as updateReduxQuiz } from "../../reducer";

export default function QuestionsTab({ qid }: { qid: string }) {
  const [questions, setQuestions] = useState<questionClient.Question[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const dispatch = useDispatch();

  // ✅ recompute quiz points + questionsCount and sync DB + Redux
  const recomputeQuizPoints = async (
    updatedQuestions: questionClient.Question[]
  ): Promise<void> => {
    const totalPoints = updatedQuestions.reduce(
      (sum: number, q: questionClient.Question) => sum + (q.points || 0),
      0
    );

    // 1️⃣ Fetch the existing quiz to keep all fields
    const existingQuiz = await quizClient.fetchQuizById(qid);

    if (!existingQuiz._id) {
      // Should never happen if backend is correct, but just in case
      return;
    }

    // 2️⃣ Update quiz in DB with new points + questionsCount
    const updatedQuiz = await quizClient.updateQuiz({
      _id: existingQuiz._id,
      ...existingQuiz,
      points: totalPoints,
      questionsCount: updatedQuestions.length,
    });

    // 3️⃣ Update Redux store so list & details see new values
    dispatch(updateReduxQuiz(updatedQuiz));
  };

  const load = async () => {
  const data = await questionClient.fetchQuestions(qid);
  setQuestions(data);
};

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  const addQuestion = async () => {
    const q = await questionClient.createQuestion(qid, {
      type: "MCQ",
      title: "New Question",
      points: 1,
      question: "",
      choices: ["Choice 1", "Choice 2"],
      correctChoice: 0,
    });

    const newQuestions = [...questions, q];
    setQuestions(newQuestions);
    await recomputeQuizPoints(newQuestions);
    setEditing(q._id!);
  };

  const deleteQuestion = async (questionId: string) => {
    if (!window.confirm("Delete this question?")) return;

    await questionClient.deleteQuestion(questionId);

    const newQuestions = questions.filter((q) => q._id !== questionId);
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
              const saved = await questionClient.updateQuestion(updated);

              const newQuestions = questions.map((x) =>
                x._id === saved._id ? saved : x
              );

              setQuestions(newQuestions);
              await recomputeQuizPoints(newQuestions);
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
  question: questionClient.Question;
  onSave: (q: questionClient.Question) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState(question);
  const { quill, quillRef } = useQuill({
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  },
});

  useEffect(() => {
  if (!quill) return;

  quill.format("direction", "ltr");
  quill.format("align", "left");
  quill.root.setAttribute("dir", "ltr");

  quill.on("text-change", () => {
    setQ((prev) => ({
      ...prev,
      question: quill.root.innerHTML,
    }));
  });

  quill.root.innerHTML = q.question || "";

  return () => {
    quill.off("text-change");
  };
}, [quill]);  


  return (
    <Card className="p-3 mb-3">
      {/* Title */}
      <Form.Control
        className="mb-2"
        placeholder="Question Title"
        value={q.title}
        onChange={(e) => setQ({ ...q, title: e.target.value })}
      />

      {/* Points */}
      <Form.Control
        type="number"
        className="mb-2"
        placeholder="Points"
        value={q.points}
        onChange={(e) =>
          setQ({ ...q, points: Number(e.target.value) })
        }
      />

      {/* Type */}
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

      {/* Question WYSIWYG */}
      <div ref={quillRef} className="mb-3" />

      {/* MCQ choices */}
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

      {/* TRUE/FALSE */}
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

      {/* FILL BLANK */}
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

      {/* Actions */}
      <div className="mt-4 d-flex gap-2">
        <Button onClick={() => onSave(q)}>Save</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}
