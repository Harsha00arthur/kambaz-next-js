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

export default function QuestionEditor() {
    const { cid, qid, questid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const questionId = questid;

    const questions = useSelector((state: any) => state.questionsReducer?.questions ?? []);
    const existingQuestion = questions.find((q: Question) => q._id === questionId);
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
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);

            setFormData((prev) => ({
                ...prev,
                due: nextWeek.toISOString().split("T")[0],
                available: now.toISOString().split("T")[0],
                until: nextWeek.toISOString().split("T")[0],
                course: cid,
                quiz: qid,
                // Initialize options based on question type
                options: prev.questionType === "True False" ? 
                    [
                        { text: "True", isCorrect: false },
                        { text: "False", isCorrect: false }
                    ] : 
                    prev.options || []
            }));
        }
    }, [questionId, existingQuestion, isNewQuestion, cid, qid]);

    const handleInputChange = (field: keyof Question, value: any) => {
        setFormData((prev) => {
            const newData = {
                ...prev,
                [field]: value,
            };
            
            // When question type changes, set appropriate options
            if (field === 'questionType') {
                if (value === 'True False') {
                    // For True/False, set standard options but user selects via dropdown
                    newData.options = [
                        { text: "True", isCorrect: false },
                        { text: "False", isCorrect: false }
                    ];
                    newData.correctAnswer = ""; // Reset correct answer
                } else if (value === 'Multiple Choice' && (!prev.options || prev.options.length === 0)) {
                    newData.options = [
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false }
                    ];
                    newData.correctAnswer = "";
                } else if (value === 'Fill in the Blank') {
                    // Initialize with one possible answer in options
                    newData.options = [
                        { text: "", isCorrect: true } // All possible answers are "correct" for fill in blank
                    ];
                    newData.correctAnswer = "";
                }
            }
            
            return newData;
        });
    };

    // ADD THESE NEW FUNCTIONS FOR MULTIPLE CHOICE
    const addOption = () => {
        const newOptions = [...(formData.options || []), { text: "", isCorrect: false }];
        handleInputChange("options", newOptions);
    };

    const removeOption = (index: number) => {
        const newOptions = formData.options?.filter((_, i) => i !== index) || [];
        // If we're removing the option that was set as the correct answer, clear it
        if (formData.options?.[index]?.text === formData.correctAnswer) {
            setFormData(prev => ({
                ...prev,
                options: newOptions,
                correctAnswer: ""
            }));
        } else {
            handleInputChange("options", newOptions);
        }
    };

    // SIMPLIFIED: Just handle text updates for options
    const updateOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
        const newOptions = [...(formData.options || [])];
        
        if (field === 'text') {
            newOptions[index] = { ...newOptions[index], text: value as string };
        }
        
        handleInputChange("options", newOptions);
    };

    // ADD FUNCTIONS FOR FILL IN THE BLANK POSSIBLE ANSWERS (using options)
    const addPossibleAnswer = () => {
        const newOptions = [...(formData.options || []), { text: "", isCorrect: true }];
        handleInputChange("options", newOptions);
    };

    const removePossibleAnswer = (index: number) => {
        const newOptions = formData.options?.filter((_, i) => i !== index) || [];
        handleInputChange("options", newOptions);
    };

    const updatePossibleAnswer = (index: number, value: string) => {
        const newOptions = [...(formData.options || [])];
        newOptions[index] = { ...newOptions[index], text: value };
        handleInputChange("options", newOptions);
    };

    const handleSave = async (shouldPublish = false) => {
        if (!formData.title?.trim()) {
            alert("Question name is required");
            return;
        }

        // Find the correct answer from the selected option
        let correctAnswer = formData.correctAnswer || "";
        if (formData.questionType === "Multiple Choice") {
            const correctOption = formData.options?.find(option => option.isCorrect);
            correctAnswer = correctOption?.text || formData.correctAnswer || "";
        } else if (formData.questionType === "Fill in the Blank") {
            // For Fill in the Blank, use the first option as the primary correct answer
            correctAnswer = formData.options?.[0]?.text || "";
        }

        const questionData: Question = {
            _id: isNewQuestion ? Date.now().toString() : formData._id!,
            questionType: formData.questionType || "Multiple Choice",
            questionGroup: formData.questionGroup || "Computer Science",
            title: formData.title!,
            question: formData.question || "",
            points: Number(formData.points) || 0,
            correctAnswer: correctAnswer,
            options: formData.options || [],
            published: shouldPublish || formData.published || false,
            quiz: qid!,
        };

        try {
            if (isNewQuestion) {
                const created = await questionClient.createQuestion(cid!, qid!, questionData);
                dispatch(addQuestion(created));
            } else {
                const updated = await questionClient.updateQuestion(qid!, questionId!, questionData);
                dispatch(updateQuestion(updated));
            }

            navigate(`/(Kambaz)/Courses/${cid}/Quizzes/${qid}/Questions`);
        } catch (err) {
            console.error("Error saving question:", err);
            alert("Failed to save question.");
        }
    };

    // const handlePublish = async () => {
    //     if (!formData._id) return;

    //     try {
    //         const updated = await questionClient.updateQuestion(qid!, formData._id, {
    //             ...formData,
    //             published: true,
    //         });
    //         setFormData(updated);
    //         dispatch(updateQuestion(updated));
    //     } catch (err) {
    //         console.error("Failed to publish:", err);
    //         alert("Failed to update publish status.");
    //     }
    // };

    const handleSavePublish = async () => {
        await handleSave(true);
    };

    const handleCancel = () => {
        navigate(`/(Kambaz)/Courses/${cid}/Quizzes/${qid}/Questions`);
    };

    if (!isNewQuestion && !existingQuestion && questionId !== 'new') {
        return <div>Question not found.</div>;
    }

    return (
        <div id="wd-questions-editor" className="container mt-4">
                    {/* TOP ROW: Title, Question Type, and Points */}
                    <Row className="mb-4">
                        <Col md={5}>
                            <Form.Group controlId="wd-question-name">
                                <Form.Label>Question Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.title || ""}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    placeholder="Enter question title"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Question Type</Form.Label>
                                <FormSelect
                                    value={formData.questionType}
                                    onChange={(e) => handleInputChange("questionType", e.target.value)}
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
                                        onChange={(e) => handleInputChange("points", Number(e.target.value))}
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
                            onChange={(e) => handleInputChange("questionGroup", e.target.value)}
                            >
                            <option>Computer Science</option>
                            <option>Data Science</option>
                        </FormSelect>
                    </Form.Group>

                    {/* WYSIWYG Question Content */}
                    <Form.Group className="mb-3" controlId="wd-question-question">
                        <Form.Label>Question:</Form.Label>
                        <Editor
                            value={formData.question || ""}
                            onChange={(e) => handleInputChange("question", e.target.value)}
                            placeholder="Enter your question here..."
                            style={{ minHeight: '200px' }}
                        />
                    </Form.Group>

                    {/* CONDITIONAL SECTIONS */}
                    {formData.questionType === "Multiple Choice" && (
                        <>
                            <Card className="mb-3">
                                <Card.Header>Multiple Choice Options
                                    <small className="text-muted d-block">Add all answer options below</small>
                                </Card.Header>
                                <Card.Body>
                                    {formData.options?.map((option, index) => (
                                        <div key={index} className="d-flex mb-2 align-items-center">
                                            <Form.Control
                                                type="text"
                                                value={option.text}
                                                onChange={(e) => updateOption(index, 'text', e.target.value)}
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
                                    onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
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
                                onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
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
                                <small className="text-muted d-block">Add all possible correct answers (case-insensitive matching)</small>
                            </Card.Header>
                            <Card.Body>
                                {formData.options?.map((option, index) => (
                                    <div key={index} className="d-flex mb-2 align-items-center">
                                        <Form.Control
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => updatePossibleAnswer(index, e.target.value)}
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
                                <Button variant="outline-danger" onClick={addPossibleAnswer}>
                                    Add Possible Answer
                                </Button>
                            </Card.Body>
                        </Card>
                    )}

                    {/* REMOVE SEPARATE OPTIONS FIELD - it's now handled by conditional sections above */}

                    <Form.Group className="mb-3" controlId="wd-question-published">
                        <Form.Check
                            type="checkbox"
                            label="Published"
                            checked={formData.published ?? false}
                            onChange={(e) => handleInputChange("published", e.target.checked)}
                        />
                    </Form.Group>

                    {/* Buttons */}
                    <hr />
                    <div className="float-end">
                        <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                        </Button>
                        <Button variant="danger" className="ms-2" onClick={() => handleSave()}>
                        Save
                        </Button>
                        <Button variant="success" className="ms-2" onClick={handleSavePublish}>
                        Save and Publish
                        </Button>
                    </div>
        </div>
    );
}