"use client";

import {
  ListGroup,
  ListGroupItem,
  Badge,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../../../store";
import type { User } from "../../../Account/client";

import QuizzesControls from "./QuizzesControls";
import {
  setQuizzes,
  deleteQuiz as deleteReduxQuiz,
  updateQuiz as updateReduxQuiz,
} from "./reducer";
import * as client from "./client";

type Quiz = client.Quiz;

function getAvailabilityLabel(quiz: Quiz): string {
  const now = new Date();

  const from = quiz.availableFromDate ? new Date(quiz.availableFromDate) : null;
  const until = quiz.availableUntilDate
    ? new Date(quiz.availableUntilDate)
    : null;

  if (from && now < from) {
    return `Not available until ${from.toLocaleDateString()}`;
  }
  if (until && now > until) {
    return "Closed";
  }
  if (from && (!until || (now >= from && now <= until))) {
    return "Available";
  }
  return "Available";
}

export default function Quizzes() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state: RootState) => state.accountReducer.currentUser as User | null
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const quizzes = useSelector(
    (state: RootState) => state.quizzesReducer?.quizzes ?? []
  ) as Quiz[];

  const courseQuizzes = quizzes.filter((q) => q.course === cid);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const loadQuizzes = async () => {
    if (!cid) return;
    try {
      const data = await client.fetchQuizzesByCourse(cid as string);
      dispatch(setQuizzes(data));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [cid]);

  const handleDeleteClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedQuiz?._id) {
      try {
        await client.deleteQuiz(selectedQuiz._id);
        dispatch(deleteReduxQuiz(selectedQuiz._id));
      } catch (e) {
        console.error(e);
      }
    }
    setShowConfirm(false);
  };

  const handleTogglePublish = async (quiz: Quiz) => {
    if (!quiz._id) return;
    try {
      const updated = await client.togglePublish(
        quiz._id,
        !quiz.published
      );
      dispatch(updateReduxQuiz(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="wd-quizzes">
      <QuizzesControls />

      {courseQuizzes.length === 0 ? (
        <div className="text-muted fst-italic">
          No quizzes yet. Click <strong>+ Quiz</strong> to create one.
        </div>
      ) : (
        <ListGroup className="rounded-0">
          <ListGroupItem className="p-0 mb-4 border-gray">
            <div className="d-flex justify-content-between align-items-center p-3 ps-2 bg-secondary-subtle">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <span className="fw-bold">QUIZZES</span>
              </div>

              <Badge bg="secondary" pill>
                Quizzes
              </Badge>
            </div>

            <ListGroup className="rounded-0">
              {courseQuizzes.map((q) => (
                <ListGroupItem
                  key={q._id}
                  className="d-flex justify-content-between align-items-center p-3 ps-1"
                >
                  <div className="flex-grow-1">
                    <BsGripVertical className="me-2 fs-3" />

                    {/* ✅ Publish / Unpublish FACULTY ONLY */}
                    {isFaculty && (
                      <Button
                        variant="link"
                        className="p-0 me-2 text-decoration-none"
                        onClick={() => handleTogglePublish(q)}
                      >
                        {q.published ? "✅" : "🚫"}
                      </Button>
                    )}

                    {/* ✅ Quiz Title */}
                    <Link
                      href={`/Courses/${cid}/Quizzes/${q._id}`}
                      className="fw-bold text-decoration-none"
                    >
                      {q.title}
                    </Link>

                    <p className="mb-0 text-muted small">
                      <span>{getAvailabilityLabel(q)}</span> |{" "}
                      <b>Due</b> {q.dueDate || "—"} |{" "}
                      <b>Points</b> {q.points ?? 0} |{" "}
                      <b>Questions</b> {q.questionsCount ?? 0} |{" "}
                      <b>Score</b> {q.score !== undefined ? q.score : "—"}
                    </p>
                  </div>

                  {/* ✅ ✅ ✅ WORKING 3-DOTS MENU (FACULTY ONLY) */}
                  {isFaculty && (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        className="d-flex align-items-center"
                      >
                        <BsThreeDotsVertical />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            router.push(`/Courses/${cid}/Quizzes/${q._id}`)
                          }
                        >
                          Edit
                        </Dropdown.Item>

                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => handleDeleteClick(q)}
                        >
                          Delete
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => handleTogglePublish(q)}
                        >
                          {q.published ? "Unpublish" : "Publish"}
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() =>
                            alert("Copy quiz not implemented yet")
                          }
                        >
                          Copy (optional)
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </ListGroupItem>
              ))}
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      )}

      {/* ✅ Delete Confirm Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedQuiz?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
