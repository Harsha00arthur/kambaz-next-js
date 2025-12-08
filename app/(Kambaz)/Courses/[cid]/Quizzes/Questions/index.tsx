"use client";

import {
  ListGroup,
  Button,
  Row,
  Col,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { BsCheckCircle, BsGripVertical, BsXCircle } from "react-icons/bs";
import GreenCheckmark from "../../Modules/GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { deleteQuestion, setQuestions, type Question } from "./reducer";
import { useEffect, useState } from "react";
import * as questionClient from "./client";
import { RxRocket } from "react-icons/rx";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function Questions() {
  const params = useParams();
  const cid = params?.cid as string;
  const qid = params?.qid as string;

  const router = useRouter();
  const dispatch = useDispatch();

  const allQuestions = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.questionsReducer?.questions ?? []
  );
  const questions = allQuestions.filter(
    (question: Question) => question.quiz === qid
  );

  const { currentUser } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.accountReducer
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const handleAddQuestion = () => {
    router.push(
      `/Courses/${cid}/Quizzes/${qid}/Questions/new`
    );
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] =
    useState<string | null>(null);

  const openDeleteConfirmation = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setShowConfirmModal(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedQuestionId(null);
    setShowConfirmModal(false);
  };

  const togglePublish = async (question: Question) => {
    try {
      const updated = await questionClient.updateQuestion(
        qid!,
        question._id,
        {
          ...question,
          published: !question.published,
        }
      );
      dispatch(
        setQuestions(
          questions.map((q: Question) =>
            q._id === question._id ? updated : q
          )
        )
      );
    } catch (err) {
      console.error("Failed to toggle publish status", err);
      alert("Failed to update publish status.");
    }
  };

  const confirmDelete = async () => {
    if (selectedQuestionId) {
      try {
        const success = await questionClient.deleteQuestion(
          qid!,
          selectedQuestionId
        );
        if (success) {
          dispatch(deleteQuestion(selectedQuestionId));
        } else {
          alert("Failed to delete question");
        }
      } catch (error) {
        console.error("Delete failed", error);
        alert("An error occurred");
      } finally {
        closeDeleteConfirmation();
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questions =
          await questionClient.fetchQuestionsForQuiz(
            cid!,
            qid!
          );
        dispatch(setQuestions(questions));
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };
    if (cid) fetchData();
  }, [cid, qid, dispatch]);

  const [searchTerm] = useState("");
  const filteredQuestions = questions.filter(
    (question: Question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="questions-wrapper">
      <div className="questions-content">
        <div className="questions-header mb-3">
          <Row className="align-items-center">
            <Col>{/* search UI was commented out */}</Col>
            <Col className="d-flex justify-content-end">
              {isFaculty && (
                <div id="wd-question-handling-buttons">
                  <Button
                    variant="secondary"
                    onClick={handleAddQuestion}
                  >
                    <FaPlus className="justify-content-between align-items-center" />{" "}
                    New Question
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
            <BsGripVertical className="me-2 fs-3" /> Questions
          </div>
        </ListGroup.Item>

        {filteredQuestions.length === 0 ? (
          <ListGroup.Item className="p-3 text-muted fst-italic">
            No questions available. Click the &quot;+ New Question&quot; button
            to add one.
          </ListGroup.Item>
        ) : (
          filteredQuestions.map((question: Question) => (
            <ListGroup.Item
              key={question._id}
              className="question-item p-3"
            >
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center">
                  <RxRocket className="me-2 fs-3 text-success" />
                  <div>
                    <div className="question-header text-black fs-4 mb-1">
                      {isFaculty ? (
                        <Link
                          href={`/Courses/${cid}/Quizzes/${qid}/Questions/${question._id}`}
                          className="text-danger text-decoration-none"
                        >
                          {question.title}
                        </Link>
                      ) : (
                        <span className="text-danger">
                          {question.title}
                        </span>
                      )}
                    </div>
                    <div className="fs-6 text-muted">
                      <span>
                        <b>Type:</b> {question.questionType}
                      </span>
                      <span className="mx-2">|</span>
                      <span>
                        <b>Question:</b>{" "}
                        {question.question
                          ? question.question
                          : "No question text provided"}
                      </span>
                      <span className="mx-2">|</span>
                      <span>{question.points} pts</span>
                    </div>
                  </div>
                </div>

                {isFaculty && (
                  <div className="d-flex align-items-center">
                    {question.published ? (
                      <GreenCheckmark />
                    ) : null}
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="link"
                        className="p-0 ms-2 text-light"
                      >
                        <IoEllipsisVertical className="fs-4 text-dark" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            router.push(
                              `/Courses/${cid}/Quizzes/${qid}/Questions/${question._id}`
                            )
                          }
                        >
                          <FaEdit className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            openDeleteConfirmation(question._id)
                          }
                        >
                          <FaTrash className="me-2 text-danger" />
                          Delete
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => togglePublish(question)}
                        >
                          {question.published ? (
                            <span>
                              <BsXCircle
                                className="text-danger me-2"
                                title="Unpublish"
                              />
                              Unpublish
                            </span>
                          ) : (
                            <span>
                              <BsCheckCircle
                                className="text-success me-2"
                                title="Publish"
                              />
                              Publish
                            </span>
                          )}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>

      <Modal
        show={showConfirmModal}
        onHide={closeDeleteConfirmation}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this question?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeDeleteConfirmation}
          >
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
