"use client";


import { Button, Form, Tabs, Tab } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../store";
import type { User } from "../../../../../Account/client";

import * as client from "../../client";
import { updateQuiz as updateReduxQuiz } from "../../reducer";
import QuestionsTab from "./QuestionsTab";

type Quiz = client.Quiz;

export default function QuizEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state: RootState) => state.accountReducer.currentUser as User | null
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const quizzes = useSelector(
    (state: RootState) => state.quizzesReducer?.quizzes ?? []
  ) as Quiz[];

  const existingQuiz = quizzes.find((q) => q._id === qid);

  const [quiz, setQuiz] = useState<Quiz | null>(existingQuiz || null);
  const [activeTab, setActiveTab] = useState("details");

  // ✅ Faculty-only protection
  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    }
  }, [isFaculty, cid, qid, router]);

  // ✅ If page refreshed, fetch quiz from backend
  useEffect(() => {
    const load = async () => {
      if (existingQuiz || !qid) return;
      const fetched = await client.fetchQuizById(qid as string);
      setQuiz(fetched);
      dispatch(updateReduxQuiz(fetched));
    };
    load();
  }, [qid, existingQuiz, dispatch]);

  if (!quiz) return null;

  // ✅ Default values
  const computedPoints = quiz.points ?? 0;

  // ---------------- ACTIONS ----------------

  const handleSave = async () => {
    const saved = await client.updateQuiz(quiz);
    dispatch(updateReduxQuiz(saved));
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    const saved = await client.updateQuiz({ ...quiz, published: true });
    dispatch(updateReduxQuiz(saved));
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  // ---------------- UI ----------------

  return (
    <div id="wd-quiz-editor" className="p-4">

      {/* ✅ TOP BUTTONS */}
      <div className="d-flex justify-content-end gap-2 mb-3">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>

        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>

        <Button variant="success" onClick={handleSaveAndPublish}>
          Save & Publish
        </Button>
      </div>

      {/* ✅ TABS */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "details")}
        className="mb-4"
      >
        <Tab eventKey="details" title="Details" />
        <Tab eventKey="questions" title="Questions" />
      </Tabs>

      {/* ✅ DETAILS TAB */}
      {activeTab === "details" && (
        <Form>

          {/* ✅ TITLE */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={quiz.title}
              onChange={(e) =>
                setQuiz({ ...quiz, title: e.target.value })
              }
            />
          </Form.Group>

          {/* ✅ DESCRIPTION (WYSIWYG SIMPLIFIED) */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={quiz.description || ""}
              onChange={(e) =>
                setQuiz({ ...quiz, description: e.target.value })
              }
            />
          </Form.Group>

          {/* ✅ QUIZ TYPE */}
          <Form.Group className="mb-3">
            <Form.Label>Quiz Type</Form.Label>
            <Form.Select
                value={quiz.quizType || "Graded Quiz"}
                onChange={(e) =>
                setQuiz({
                    ...quiz,
                    quizType: e.target.value as
                    | "Graded Quiz"
                    | "Practice Quiz"
                    | "Graded Survey"
                    | "Ungraded Survey",
                })
                }
            >
                <option value="Graded Quiz">Graded Quiz</option>
                <option value="Practice Quiz">Practice Quiz</option>
                <option value="Graded Survey">Graded Survey</option>
                <option value="Ungraded Survey">Ungraded Survey</option>
            </Form.Select>
            </Form.Group>



          {/* ✅ POINTS (AUTO COMPUTED) */}
          <Form.Group className="mb-3">
            <Form.Label>Points</Form.Label>
            <Form.Control value={computedPoints} disabled />
          </Form.Group>

          {/* ✅ ASSIGNMENT GROUP */}
          <Form.Group className="mb-3">
            <Form.Label>Assignment Group</Form.Label>
            <Form.Select>
              <option>Quizzes</option>
              <option>Exams</option>
              <option>Assignments</option>
              <option>Project</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ SHUFFLE ANSWERS */}
          <Form.Group className="mb-3">
            <Form.Label>Shuffle Answers</Form.Label>
            <Form.Select>
              <option>Yes</option>
              <option>No</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ TIME LIMIT */}
          <Form.Group className="mb-3">
            <Form.Label>Time Limit (minutes)</Form.Label>
            <Form.Control type="number" defaultValue={20} />
          </Form.Group>

          {/* ✅ MULTIPLE ATTEMPTS */}
          <Form.Group className="mb-3">
            <Form.Label>Multiple Attempts</Form.Label>
            <Form.Select>
              <option>No</option>
              <option>Yes</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ SHOW CORRECT ANSWERS */}
          <Form.Group className="mb-3">
            <Form.Label>Show Correct Answers</Form.Label>
            <Form.Select>
              <option>Immediately</option>
              <option>After Due Date</option>
              <option>Never</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ ACCESS CODE */}
          <Form.Group className="mb-3">
            <Form.Label>Access Code</Form.Label>
            <Form.Control type="text" placeholder="Optional" />
          </Form.Group>

          {/* ✅ ONE QUESTION AT A TIME */}
          <Form.Check
            label="One Question at a Time"
            defaultChecked
            className="mb-2"
          />

          {/* ✅ WEBCAM REQUIRED */}
          <Form.Check
            label="Webcam Required"
            className="mb-2"
          />

          {/* ✅ LOCK AFTER ANSWER */}
          <Form.Check
            label="Lock Questions After Answering"
            className="mb-2"
          />

          {/* ✅ DATES */}
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={quiz.dueDate || ""}
              onChange={(e) =>
                setQuiz({ ...quiz, dueDate: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Date</Form.Label>
            <Form.Control
              type="date"
              value={quiz.availableFromDate || ""}
              onChange={(e) =>
                setQuiz({ ...quiz, availableFromDate: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Until Date</Form.Label>
            <Form.Control
              type="date"
              value={quiz.availableUntilDate || ""}
              onChange={(e) =>
                setQuiz({ ...quiz, availableUntilDate: e.target.value })
              }
            />
          </Form.Group>

        </Form>
      )}

      {/* ✅ QUESTIONS TAB */}
      {activeTab === "questions" && (
      <QuestionsTab qid={qid as string} />
      )}

    </div>
  );
}
