"use client";

import {
  ListGroup,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { BsCheckCircle, BsGripVertical, BsXCircle } from "react-icons/bs";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaPlay } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { deleteQuiz, setQuizzes, type Quiz } from "./reducer";
import { useEffect, useState } from "react";
import * as quizClient from "./client";
import { RxRocket } from "react-icons/rx";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const courseId = Array.isArray(cid) ? cid[0] : cid;

  const allQuizzes = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.quizzesReducer?.quizzes ?? []
  );

  const quizzes = allQuizzes
    .filter((quiz: Quiz) => quiz.course === courseId)
    .sort(
      (a: Quiz, b: Quiz) =>
        new Date(a.available).getTime() -
        new Date(b.available).getTime()
    );

  const { currentUser } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.accountReducer
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const displayedQuizzes = isFaculty
    ? quizzes
    : quizzes.filter((quiz: Quiz) => quiz.published);

  const handleAddQuiz = () => {
    router.push(`/Courses/${courseId}/Quizzes/new`);
  };

  const handleTakeQuiz = (quizId: string) => {
    router.push(
      `/Courses/${courseId}/Quizzes/${quizId}/Preview`
    );
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(
    null
  );

  const openDeleteConfirmation = (quizId: string) => {
    setSelectedQuizId(quizId);
    setShowConfirmModal(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedQuizId(null);
    setShowConfirmModal(false);
  };

  const togglePublish = async (quiz: Quiz) => {
    try {
      const updated = await quizClient.updateQuiz(quiz._id, {
        ...quiz,
        published: !quiz.published,
      });

      dispatch(
        setQuizzes(
          quizzes.map((q: Quiz) =>
            q._id === quiz._id ? updated : q
          )
        )
      );
    } catch (err) {
      console.error("Failed to toggle publish status", err);
      alert("Failed to update publish status.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedQuizId) return;
    try {
      const success = await quizClient.deleteQuiz(selectedQuizId);
      if (success) {
        dispatch(deleteQuiz(selectedQuizId));
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      closeDeleteConfirmation();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzes = await quizClient.fetchQuizzesForCourse(
          courseId!
        );
        dispatch(setQuizzes(quizzes));
      } catch (error) {
        console.error("Error loading quizzes:", error);
      }
    };
    if (courseId) fetchData();
  }, [courseId, dispatch]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = displayedQuizzes.filter((quiz: Quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isQuizAvailable = (quiz: Quiz) => {
    const now = new Date();
    const availableDate = new Date(quiz.available);
    return now >= availableDate;
  };

  return (
    <div className="quizzes-wrapper">
      <div className="quizzes-content">
        <div className="quizzes-header mb-3">
          <Row className="align-items-center">
            <Col>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </InputGroup>
            </Col>

            <Col className="d-flex justify-content-end">
              {isFaculty && (
                <div id="wd-quiz-handling-buttons">
                  <Button variant="danger" onClick={handleAddQuiz}>
                    <FaPlus /> Quiz
                  </Button>
                  <Button variant="secondary" className="ms-2">
                    <IoEllipsisVertical />
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>

      <ListGroup className="rounded-0 modules-list">
        <ListGroup.Item className="module-item p-0 fs-5 border-gray">
          <div className="module-title p-3 ps-2 bg-secondary text-black">
            <BsGripVertical className="me-2 fs-3" />
            Quizzes
          </div>
        </ListGroup.Item>

        {filteredQuizzes.map((quiz: Quiz) => (
          <ListGroup.Item
            key={quiz._id}
            className="quiz-item p-3"
            style={{
              borderLeft: "4px solid rgb(0, 128, 0)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center flex-grow-1">
                <RxRocket className="me-2 fs-3 text-success" />
                <div className="flex-grow-1">
                  <div className="quiz-header text-black fs-4 mb-1">
                    {isFaculty ? (
                      <Link
                        href={`/Courses/${courseId}/Quizzes/${quiz._id}/Details`}
                        className="text-danger text-decoration-none"
                      >
                        {quiz.title}
                      </Link>
                    ) : (
                      <span className="text-danger">{quiz.title}</span>
                    )}
                  </div>

                  <div className="fs-6 text-muted">
                    <b>Available</b>{" "}
                    {new Date(quiz.available).toLocaleString()} |{" "}
                    <b>Due</b>{" "}
                    {new Date(quiz.due).toLocaleString()} |{" "}
                    {quiz.points} pts
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                {!isFaculty && isQuizAvailable(quiz) && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleTakeQuiz(quiz._id)}
                  >
                    <FaPlay /> Take Quiz
                  </Button>
                )}

                {isFaculty && (
                  <>
                    {quiz.published && <GreenCheckmark />}
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link">
                        <IoEllipsisVertical />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            router.push(
                              `/Courses/${courseId}/Quizzes/${quiz._id}`
                            )
                          }
                        >
                          <FaEdit /> Edit
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() =>
                            openDeleteConfirmation(quiz._id)
                          }
                        >
                          <FaTrash /> Delete
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => togglePublish(quiz)}
                        >
                          {quiz.published ? (
                            <>
                              <BsXCircle /> Unpublish
                            </>
                          ) : (
                            <>
                              <BsCheckCircle /> Publish
                            </>
                          )}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                )}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Delete Modal */}
      <Modal
        show={showConfirmModal}
        onHide={closeDeleteConfirmation}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this quiz?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeDeleteConfirmation}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}