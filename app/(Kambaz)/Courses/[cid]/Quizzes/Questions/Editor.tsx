"use client";

import {
  Form,
  FormSelect,
  Button,
  Card,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addQuestion, updateQuestion } from "./reducer";
import type { Question } from "./reducer";
import { useState, useEffect } from "react";
import * as questionClient from "./client";
import Editor from "../Editor";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function QuestionEditor() {
  const params = useParams();
  const cid = params?.cid as string;
  const qid = params?.qid as string;
  const questionId = params?.questid as string;

  const router = useRouter();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questions = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.questionsReducer?.questions ?? []
  );

  const existingQuestion = questions.find(
    (q: Question) => q._id === questionId
  );
  const isNewQuestion = questionId === "new" || !existingQuestion;

  const [formData, setFormData] = useState<Partial<Question>>({
    questionType: "Multiple Choice",
    questionGroup: "Computer Science",
    title: "Unnamed Question",
    question: "",
    points: 0,
    correctAnswer: "",
    options: [],
    published: false,
  });

  useEffect(() => {
    if (!isNewQuestion && existingQuestion) {
      setFormData({ ...existingQuestion });
    } else if (isNewQuestion) {
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);

      setFormData((prev) => ({
        ...prev,
        due: nextWeek.toISOString().split("T")[0],
        available: now.toISOString().split("T")[0],
        until: nextWeek.toISOString().split("T")[0],
        course: cid,
        quiz: qid,
        options:
          prev.questionType === "True False"
            ? [
                { text: "True", isCorrect: false },
                { text: "False", isCorrect: false },
              ]
            : prev.options || [],
      }));
    }
  }, [questionId, existingQuestion, isNewQuestion, cid, qid]);

  const handleInputChange = <K extends keyof Question>(
    field: K,
    value: Question[K]
  ) => {
    setFormData((prev) => {
      const newData: Partial<Question> = {
        ...prev,
        [field]: value,
      };

      if (field === "questionType") {
        if (value === "True False") {
          newData.options = [
            { text: "True", isCorrect: false },
            { text: "False", isCorrect: false },
          ];
          newData.correctAnswer = "";
        } else if (value === "Multiple Choice") {
          newData.options = [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ];
          newData.correctAnswer = "";
        } else if (value === "Fill in the Blank") {
          newData.options = [{ text: "", isCorrect: true }];
          newData.correctAnswer = "";
        }
      }

      return newData;
    });
  };

  const addOption = () => {
    handleInputChange("options", [
      ...(formData.options || []),
      { text: "", isCorrect: false },
    ] as Question["options"]);
  };

  const removeOption = (index: number) => {
    const newOptions =
      formData.options?.filter((_, i) => i !== index) || [];
    handleInputChange("options", newOptions as Question["options"]);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], text: value };
    handleInputChange("options", newOptions as Question["options"]);
  };

  const addPossibleAnswer = () => {
    handleInputChange("options", [
      ...(formData.options || []),
      { text: "", isCorrect: true },
    ] as Question["options"]);
  };

  const removePossibleAnswer = (index: number) => {
    const newOptions =
      formData.options?.filter((_, i) => i !== index) || [];
    handleInputChange("options", newOptions as Question["options"]);
  };

  const updatePossibleAnswer = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], text: value };
    handleInputChange("options", newOptions as Question["options"]);
  };

  const handleSave = async (shouldPublish = false) => {
    if (!formData.title?.trim()) {
      alert("Question name is required");
      return;
    }

    let correctAnswer = formData.correctAnswer || "";

    if (formData.questionType === "Multiple Choice") {
      const correctOption = formData.options?.find((o) => o.isCorrect);
      correctAnswer = correctOption?.text || "";
    } else if (formData.questionType === "Fill in the Blank") {
      correctAnswer = formData.options?.[0]?.text || "";
    }

    const questionData: Question = {
      _id: isNewQuestion ? Date.now().toString() : formData._id!,
      questionType: formData.questionType || "Multiple Choice",
      questionGroup: formData.questionGroup || "Computer Science",
      title: formData.title!,
      question: formData.question || "",
      points: Number(formData.points) || 0,
      correctAnswer,
      options: formData.options || [],
      published: shouldPublish || formData.published || false,
      quiz: qid!,
    };

    try {
      if (isNewQuestion) {
        const created = await questionClient.createQuestion(
          cid!,
          qid!,
          questionData
        );
        dispatch(addQuestion(created));
      } else {
        // NOTE: updateQuestion(client) expects (questionId, questionData)
        const updated = await questionClient.updateQuestion(
        cid!,
        questionId!,
        questionData
        );
        dispatch(updateQuestion(updated));

      }

      router.push(
        `/Courses/${cid}/Quizzes/${qid}/Questions`
      );
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Failed to save question.");
    }
  };

  const handleSavePublish = async () => {
    await handleSave(true);
  };

  const handleCancel = () => {
    router.push(
      `/Courses/${cid}/Quizzes/${qid}/Questions`
    );
  };

  if (!isNewQuestion && !existingQuestion && questionId !== "new") {
    return <div>Question not found.</div>;
  }

  return (
    <div id="wd-questions-editor" className="container mt-4">
      <Row className="mb-4">
        <Col md={5}>
          <Form.Group controlId="wd-question-name">
            <Form.Label>Question Title</Form.Label>
            <Form.Control
              type="text"
              value={formData.title || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("title", e.target.value)
              }
              placeholder="Enter question title"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Question Type</Form.Label>
            <FormSelect
              value={formData.questionType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange(
                  "questionType",
                  e.target.value as Question["questionType"]
                )
              }
            >
              <option>Multiple Choice</option>
              <option>True False</option>
              <option>Fill in the Blank</option>
            </FormSelect>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Points</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                value={formData.points}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("points", Number(e.target.value))
                }
                min="1"
              />
              <InputGroup.Text>pts</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Question Group</Form.Label>
        <FormSelect
          value={formData.questionGroup}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleInputChange(
              "questionGroup",
              e.target.value as Question["questionGroup"]
            )
          }
        >
          <option>Computer Science</option>
          <option>Data Science</option>
        </FormSelect>
      </Form.Group>

      <Form.Group className="mb-3" controlId="wd-question-question">
        <Form.Label>Question:</Form.Label>
        {React.createElement(Editor as React.ComponentType<{
        value?: string;
        onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        placeholder?: string;
        style?: React.CSSProperties;
        }>, {
            value: formData.question || "",
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange("question", e.target.value),
            placeholder: "Enter your question here...",
            style: { minHeight: "200px" },
        })}

      </Form.Group>

      {formData.questionType === "Multiple Choice" && (
        <>
          <Card className="mb-3">
            <Card.Header>
              Multiple Choice Options
              <small className="text-muted d-block">
                Add all answer options below
              </small>
            </Card.Header>
            <Card.Body>
              {formData.options?.map((option, index) => (
                <div
                  key={index}
                  className="d-flex mb-2 align-items-center"
                >
                  <Form.Control
                    type="text"
                    value={option.text}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="me-2"
                  />
                  {formData.options!.length > 2 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline-primary" onClick={addOption}>
                Add Option
              </Button>
            </Card.Body>
          </Card>

          <Form.Group className="mb-3">
            <Form.Label>Correct Answer</Form.Label>
            <FormSelect
              value={formData.correctAnswer}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange("correctAnswer", e.target.value)
              }
            >
              <option value="">Select correct answer</option>
              {formData.options?.map((option, index) => (
                <option key={index} value={option.text}>
                  {option.text || `Option ${index + 1}`}
                </option>
              ))}
            </FormSelect>
          </Form.Group>
        </>
      )}

      {formData.questionType === "True False" && (
        <Form.Group className="mb-3">
          <Form.Label>Correct Answer</Form.Label>
          <FormSelect
            value={formData.correctAnswer}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleInputChange("correctAnswer", e.target.value)
            }
          >
            <option value="">Select correct answer</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </FormSelect>
        </Form.Group>
      )}

      {formData.questionType === "Fill in the Blank" && (
        <Card className="mb-3">
          <Card.Header>
            Possible Correct Answers
            <small className="text-muted d-block">
              Add all possible correct answers (case-insensitive
              matching)
            </small>
          </Card.Header>
          <Card.Body>
            {formData.options?.map((option, index) => (
              <div
                key={index}
                className="d-flex mb-2 align-items-center"
              >
                <Form.Control
                  type="text"
                  value={option.text}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => updatePossibleAnswer(index, e.target.value)}
                  placeholder={`Possible answer ${index + 1}`}
                  className="me-2"
                />
                {formData.options!.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removePossibleAnswer(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline-danger"
              onClick={addPossibleAnswer}
            >
              Add Possible Answer
            </Button>
          </Card.Body>
        </Card>
      )}

      <Form.Group className="mb-3" controlId="wd-question-published">
        <Form.Check
          type="checkbox"
          label="Published"
          checked={formData.published ?? false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange("published", e.target.checked)
          }
        />
      </Form.Group>

      <hr />
      <div className="float-end">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="danger"
          className="ms-2"
          onClick={() => handleSave()}
        >
          Save
        </Button>
        <Button
          variant="success"
          className="ms-2"
          onClick={handleSavePublish}
        >
          Save and Publish
        </Button>
      </div>
    </div>
  );
}
