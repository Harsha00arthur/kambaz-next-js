"use client";
import { useEffect, useState } from "react";
import * as quizClient from "./client";
import { Button, Card, Spinner } from "react-bootstrap";
import type { Quiz } from "./reducer";
import { FaPencil } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { updateQuiz } from "./reducer";
import { useParams, useRouter } from "next/navigation";

export default function Details() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const editor = `/(Kambaz)/Courses/${courseId}/Quizzes/${quizId}`;
  const preview = `/(Kambaz)/Courses/${courseId}/Quizzes/${quizId}/Preview`;

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizzes = await quizClient.fetchQuizzesForCourse(courseId!);
        const found = quizzes.find((q: Quiz) => q._id === quizId);
        setQuiz(found || null);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [courseId, quizId]);

  const handlePublishToggle = async () => {
    if (!quiz) return;

    setUpdating(true);
    try {
      const updatedQuiz = await quizClient.updateQuiz(quiz._id, {
        ...quiz,
        published: !quiz.published,
      });
      setQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
    } catch (err) {
      console.error("Failed to update quiz publish status:", err);
      alert("Failed to update quiz publish status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!quiz) return <div>Quiz not found.</div>;

  return (
    <div>
      <div className="d-flex justify-content-center my-3">
        <Button className="me-2" variant="secondary" onClick={() => router.push(preview)}>
          Preview
        </Button>
        <Button className="me-2" variant="secondary" onClick={() => router.push(editor)}>
          <FaPencil className="me-2" />
          Edit Quiz
        </Button>
      </div>

      <hr />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{quiz.title}</h2>
          <span className={`badge ${quiz.published ? "bg-success" : "bg-secondary"}`}>
            {quiz.published ? "Published" : "Unpublished"}
          </span>
        </div>

        <Card className="mt-3 justify-content-center align-items-center">
          <Card.Body>
            <p><strong>Quiz Type:</strong> {quiz.quizType}</p>
            <p><strong>Points:</strong> {quiz.points}</p>
            <p><strong>Assignment Group:</strong> {quiz.assignmentGroup}</p>
            <p><strong>Time Limit:</strong> {quiz.timeLimit} minutes</p>
            <p><strong>Multiple Attempts:</strong> {quiz.multipleAttempts ? "Yes" : "No"}</p>
            <p><strong>Show Correct Answers:</strong> {quiz.showCorrectAnswers}</p>
            <p><strong>Shuffle Answers:</strong> {quiz.shuffleAnswers ? "Yes" : "No"}</p>
            <p><strong>One Question at a Time:</strong> {quiz.oneQuestionAtATime ? "Yes" : "No"}</p>
            <p><strong>Webcam Required:</strong> {quiz.webcamRequired ? "Yes" : "No"}</p>
            <p><strong>Lock Questions After Answering:</strong> {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</p>
            <p><strong>Access Code:</strong> {quiz.accessCode || "(None)"}</p>
            <p><strong>Description:</strong> {quiz.description}</p>
          </Card.Body>

          <table className="table">
            <thead>
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{quiz.due}</td>
                <td>{quiz.assignTo}</td>
                <td>{quiz.available}</td>
                <td>{quiz.until}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Button
          variant={quiz.published ? "danger" : "success"}
          onClick={handlePublishToggle}
          disabled={updating}
          className="mb-2 mt-2 float-end"
        >
          {updating && <Spinner animation="border" size="sm" className="me-2 ms-2" />}
          {quiz.published ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
