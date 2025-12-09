"use client";

import { Button } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import type { User } from "../../../../Account/client";

import * as client from "../client";
import { updateQuiz as updateReduxQuiz } from "../reducer";

type Quiz = client.Quiz;

export default function QuizDetails() {
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

  useEffect(() => {
    const load = async () => {
      if (existingQuiz || !qid) return;
      try {
        const fetched = await client.fetchQuizById(qid as string);
        setQuiz(fetched);
        dispatch(updateReduxQuiz(fetched));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [qid, existingQuiz, dispatch]);

  if (!quiz) return null;

  const totalPoints = quiz.points ?? 0;

  return (
    <div id="wd-quiz-details" className="p-4 border rounded">
      {/* ✅ HEADER */}
      <div className="d-flex justify-content-end gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
        >
          Preview
        </Button>

        {isFaculty && (
          <Button
            variant="secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}
          >
            Edit
          </Button>
        )}
      </div>

      <h3 className="fw-bold mb-4">{quiz.title}</h3>

      {/* ✅ STUDENT VIEW */}
      {!isFaculty && (
        <div className="mb-4">
          <Button variant="danger">Start Quiz</Button>
        </div>
      )}

      {/* ✅ FACULTY SUMMARY */}
      {isFaculty && (
        <div className="row">

          <div className="col-md-6 small">
            <p><b>Quiz Type:</b> Graded Quiz</p>
            <p><b>Points:</b> {totalPoints}</p>
            <p><b>Assignment Group:</b> Quizzes</p>
            <p><b>Shuffle Answers:</b> Yes</p>
            <p><b>Time Limit:</b> 20 Minutes</p>
            <p><b>Multiple Attempts:</b> No</p>
            <p><b>How Many Attempts:</b> 1</p>
            <p><b>Show Correct Answers:</b> Immediately</p>
            <p><b>Access Code:</b> None</p>
          </div>

          <div className="col-md-6 small">
            <p><b>One Question at a Time:</b> Yes</p>
            <p><b>Webcam Required:</b> No</p>
            <p><b>Lock Questions After Answering:</b> No</p>
          </div>

          {/* ✅ DATES SECTION */}
          <div className="mt-4">
            <hr />
            <div className="row small">
              <div className="col-md-4">
                <b>Due</b>
                <div>{quiz.dueDate || "—"}</div>
              </div>
              <div className="col-md-4">
                <b>For</b>
                <div>Everyone</div>
              </div>
              <div className="col-md-4">
                <b>Available from</b>
                <div>{quiz.availableFromDate || "—"}</div>
              </div>
              <div className="col-md-4 mt-2">
                <b>Until</b>
                <div>{quiz.availableUntilDate || "—"}</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
