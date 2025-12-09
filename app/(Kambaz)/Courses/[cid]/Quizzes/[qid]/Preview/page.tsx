"use client";

import { Button, Card, Form } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as questionsClient from "../questionsClient";
import type { Question } from "../questionsClient";

export default function QuizPreview() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // ✅ Load questions (read-only)
  useEffect(() => {
    const load = async () => {
      if (!qid) return;
      const data = await questionsClient.fetchQuestions(qid as string);
      setQuestions(data);
    };
    load();
  }, [qid]);

  // ✅ Submit quiz & compute score
  const handleSubmit = () => {
    let total = 0;

    questions.forEach((q) => {
      const ans = answers[q._id as string];

      // ✅ MCQ
      if (q.type === "MCQ" && ans === q.correctChoice) {
        total += q.points;
      }

      // ✅ TRUE / FALSE
      if (q.type === "TRUE_FALSE" && ans === q.trueFalseAnswer) {
        total += q.points;
      }

      // ✅ FILL IN THE BLANK (case-insensitive)
      if (
        q.type === "FILL_BLANK" &&
        q.blanks?.some(
          (b) =>
            b.toLowerCase().trim() ===
            String(ans).toLowerCase().trim()
        )
      ) {
        total += q.points;
      }
    });

    setScore(total);
    setSubmitted(true);
  };

  const totalPossible = questions.reduce(
    (sum, q) => sum + q.points,
    0
  );

  return (
    <div className="p-4">

      {/* ✅ HEADER BUTTONS */}
      <div className="d-flex justify-content-end gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)
          }
        >
          Edit Quiz
        </Button>
      </div>

      <h3 className="fw-bold mb-4">Quiz Preview</h3>

      {/* ✅ QUESTIONS */}
      {questions.map((q, index) => (
        <Card key={q._id} className="p-3 mb-4">

          <div className="fw-bold mb-2">
            {index + 1}. {q.title} ({q.points} pts)
          </div>

          {/* ✅ QUESTION TEXT */}
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{ __html: q.question }}
          />

          {/* ✅ MCQ */}
          {q.type === "MCQ" &&
            q.choices?.map((c, i) => (
              <Form.Check
                key={i}
                type="radio"
                label={c}
                disabled={submitted}
                checked={answers[q._id as string] === i}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [q._id as string]: i,
                  })
                }
              />
            ))}

          {/* ✅ TRUE / FALSE */}
          {q.type === "TRUE_FALSE" && (
            <>
              <Form.Check
                type="radio"
                label="True"
                disabled={submitted}
                checked={answers[q._id as string] === true}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [q._id as string]: true,
                  })
                }
              />

              <Form.Check
                type="radio"
                label="False"
                disabled={submitted}
                checked={answers[q._id as string] === false}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [q._id as string]: false,
                  })
                }
              />
            </>
          )}

          {/* ✅ FILL IN THE BLANK */}
          {q.type === "FILL_BLANK" && (
            <Form.Control
              disabled={submitted}
              placeholder="Enter your answer"
              value={answers[q._id as string] || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [q._id as string]: e.target.value,
                })
              }
            />
          )}

          {/* ✅ SHOW CORRECT ANSWER AFTER SUBMIT */}
          {submitted && (
            <div className="mt-3 text-danger">
              <b>Correct Answer:</b>{" "}
              {q.type === "MCQ" &&
                q.choices?.[q.correctChoice ?? 0]}
              {q.type === "TRUE_FALSE" &&
                String(q.trueFalseAnswer)}
              {q.type === "FILL_BLANK" && q.blanks?.join(", ")}
            </div>
          )}
        </Card>
      ))}

      {/* ✅ SUBMIT + SCORE */}
      <div className="mt-4">
        {!submitted ? (
          <Button variant="success" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        ) : (
          <h4 className="fw-bold text-success">
            Final Score: {score} / {totalPossible}
          </h4>
        )}
      </div>
    </div>
  );
}
