"use client";

import { useState, useEffect } from 'react';
import { 
    Container, 
    Card, 
    Button, 
    Form, 
    Row, 
    Col, 
    Alert, 
    Badge,
    ListGroup,
    Modal
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import * as questionClient from './Questions/client';
import * as quizClient from './client';
import { IoCheckmark } from 'react-icons/io5';
import { useParams, useRouter } from "next/navigation";

interface PreviewAnswer {
    questionId: string;
    answer: string;
    isCorrect?: boolean;
}

interface Question {
    _id: string;
    questionType: string;
    title: string;
    question: string;
    points: number;
    correctAnswer: string;
    published: boolean;
    options?: Array<{
        text: string;
        isCorrect?: boolean;
    }>;
    possibleAnswers?: string[];
}

interface Quiz {
    _id: string;
    title: string;
    description: string;
    points: number;
    timeLimit: number;
    instructions?: string;
    multipleAttempts?: boolean;
    maxAttempts?: number;
}

export default function QuizPreview() {
    const params = useParams();
    const cid = params?.cid as string;
    const qid = params?.qid as string;
    const router = useRouter();
    
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [gradedAnswers, setGradedAnswers] = useState<PreviewAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY";

    useEffect(() => {
        loadQuizData();
    }, [cid, qid]);

    const loadQuizData = async () => {
        if (!cid || !qid) return;
        
        try {
            setLoading(true);
            
            const quizData = await quizClient.fetchQuizById(qid);
            setQuiz(quizData);
            
            const allQuestions = await questionClient.fetchQuestionsForQuiz(cid, qid);
            const publishedQuestions = allQuestions.filter((q: Question) => q.published === true);
            setQuestions(publishedQuestions);
            
            const initialAnswers: Record<string, string> = {};
            publishedQuestions.forEach((q: Question) => {
                initialAnswers[q._id] = '';
            });
            setAnswers(initialAnswers);
            
        } catch (error) {
            console.error('Error loading quiz data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const gradeQuiz = () => {
        const gradedResults: PreviewAnswer[] = [];
        let totalScore = 0;
        let maxScore = 0;

        questions.forEach((question) => {
            maxScore += question.points;
            const userAnswer = answers[question._id] || '';
            let isCorrect = false;

            switch (question.questionType) {
                case 'Multiple Choice':
                case 'True False':
                    isCorrect = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
                    break;
                case 'Fill in the Blank':
                    if (question.options && question.options.length > 0) {
                        isCorrect = question.options.some(option => 
                            option.text.toLowerCase().trim() === userAnswer.toLowerCase().trim()
                        );
                    } else {
                        isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                    }
                    break;
                default:
                    isCorrect = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
            }

            if (isCorrect) {
                totalScore += question.points;
            }

            gradedResults.push({
                questionId: question._id,
                answer: userAnswer,
                isCorrect
            });
        });

        setScore(Math.round((totalScore / maxScore) * 100));
        setGradedAnswers(gradedResults);
        setShowResults(true);
    };

    const handleSubmitQuiz = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = () => {
        setShowSubmitModal(false);
        gradeQuiz();
    };

    const resetQuiz = () => {
        const resetAnswers: Record<string, string> = {};
        questions.forEach((q) => {
            resetAnswers[q._id] = '';
        });
        setAnswers(resetAnswers);
        setShowResults(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setGradedAnswers([]);
    };

    const renderQuestion = (question: Question, index: number) => {
        const userAnswer = answers[question._id] || '';
        const gradedAnswer = gradedAnswers.find(ga => ga.questionId === question._id);
        const isReviewMode = showResults;

        return (
            <Card className="mb-4" key={question._id}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0">Question {index + 1}</h5>
                        <h6 className="mb-0">{question.title}</h6>
                        <small className="text-muted">{question.points} point{question.points !== 1 ? 's' : ''}</small>
                    </div>
                    {isReviewMode && (
                        <Badge bg={gradedAnswer?.isCorrect ? 'success' : 'danger'}>
                            {gradedAnswer?.isCorrect ? <FaCheck /> : <FaTimes />}
                            {gradedAnswer?.isCorrect ? ' Correct' : ' Incorrect'}
                        </Badge>
                    )}
                </Card.Header>
                <Card.Body>
                    <div className="mb-3">
                        <div dangerouslySetInnerHTML={{ __html: question.question }} />
                    </div>

                    {question.questionType === 'Multiple Choice' && (
                        <div>
                            {question.options?.map((option, optIndex) => (
                                <Form.Check
                                    key={optIndex}
                                    type="radio"
                                    name={`question-${question._id}`}
                                    id={`question-${question._id}-option-${optIndex}`}
                                    label={option.text}
                                    value={option.text}
                                    checked={userAnswer === option.text}
                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                    disabled={isReviewMode}
                                    className={isReviewMode ? 
                                        (option.text === question.correctAnswer ? 'text-success fw-bold' : 
                                         userAnswer === option.text && !gradedAnswer?.isCorrect ? 'text-danger' : '') 
                                        : ''}
                                />
                            ))}
                        </div>
                    )}

                    {question.questionType === 'True False' && (
                        <div>
                            <Form.Check
                                type="radio"
                                name={`question-${question._id}`}
                                id={`question-${question._id}-true`}
                                label="True"
                                value="True"
                                checked={userAnswer === 'True'}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                disabled={isReviewMode}
                                className={isReviewMode ? 
                                    (question.correctAnswer === 'True' ? 'text-success fw-bold' : 
                                     userAnswer === 'True' && !gradedAnswer?.isCorrect ? 'text-danger' : '') 
                                    : ''}
                            />
                            <Form.Check
                                type="radio"
                                name={`question-${question._id}`}
                                id={`question-${question._id}-false`}
                                label="False"
                                value="False"
                                checked={userAnswer === 'False'}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                disabled={isReviewMode}
                                className={isReviewMode ? 
                                    (question.correctAnswer === 'False' ? 'text-success fw-bold' : 
                                     userAnswer === 'False' && !gradedAnswer?.isCorrect ? 'text-danger' : '') 
                                    : ''}
                            />
                        </div>
                    )}

                    {question.questionType === 'Fill in the Blank' && (
                        <div>
                            <Form.Control
                                type="text"
                                placeholder="Enter your answer"
                                value={userAnswer}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                disabled={isReviewMode}
                            />
                            {isReviewMode && (
                                <div className="mt-2">
                                    <small className="text-success">
                                        <strong>Correct answer(s): </strong>
                                        {question.options?.map(opt => opt.text).join(', ') || question.correctAnswer}
                                    </small>
                                </div>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>
        );
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!quiz || questions.length === 0) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    <h5>No Published Questions Available</h5>
                    <p>This quiz has no published questions to preview.</p>
                    {isFaculty && (
                        <div className="mt-3">
                            <Button
                                variant="primary"
                                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)}
                            >
                                <FaEdit className="me-1" />
                                Go to Questions Editor
                            </Button>
                        </div>
                    )}
                </Alert>
            </Container>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>{quiz.title} {showResults ? '- Results' : '- Preview'}</h2>
                            {!showResults && (
                                <p className="text-muted mb-0">
                                    Faculty Preview Mode • {questions.length} Published Questions • {quiz.points} Points
                                    {quiz.timeLimit && ` • ${quiz.timeLimit} Minutes`}
                                </p>
                            )}
                        </div>
                        <div>
                            {isFaculty && (
                                <Button
                                    variant="danger"
                                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)}
                                    className="me-2"
                                >
                                    <FaEdit className="me-1" />
                                    Edit Quiz
                                </Button>
                            )}
                            {showResults && !!quiz?.multipleAttempts && (
                                <Button variant="secondary" onClick={resetQuiz}>
                                    Retake Preview
                                </Button>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {showResults ? (
                <div>
                    <Alert variant="info" className="mb-4">
                        <h4>Quiz Complete!</h4>
                        <p className="mb-1">Your Score: <strong>{score}%</strong></p>
                        <p className="mb-0">
                            {gradedAnswers.filter(ga => ga.isCorrect).length} out of {questions.length} questions correct
                        </p>
                    </Alert>

                    <h4>Review Your Answers:</h4>
                    {questions.map((question, index) => renderQuestion(question, index))}
                </div>
            ) : (
                <Row>
                    <Col md={8}>
                        {renderQuestion(currentQuestion, currentQuestionIndex)}

                        <div className="d-flex justify-content-between">
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                            >
                                &lt; Previous
                            </Button>
                            
                            <div>
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <Button
                                        variant="secondary"
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                    >
                                        Next &gt;
                                    </Button>
                                ) : (
                                    <Button
                                        variant="success"
                                        onClick={handleSubmitQuiz}
                                    >
                                        Submit Quiz
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <Card.Header>
                                <h6 className="mb-0">Questions</h6>
                            </Card.Header>
                            <Card.Body className="p-2">
                                <ListGroup variant="flush">
                                    {questions.map((question, index) => (
                                        <ListGroup.Item
                                            key={question._id}
                                            action
                                            active={index === currentQuestionIndex}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`d-flex justify-content-between align-items-center py-2 ${
                                                index === currentQuestionIndex ? 'bg-secondary text-danger' : 'text-danger'
                                            }`} >
                                            <span className='text-danger'>Question {index + 1}</span>
                                            <div>
                                                {answers[question._id] && (
                                                    <Badge bg="success"><IoCheckmark /></Badge>
                                                )}
                                                <small className="text-muted ms-2">{question.points}pts</small>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>

                        <Card className="mt-3">
                            <Card.Body>
                                <h6>Progress</h6>
                                <p className="mb-1">
                                    {Object.values(answers).filter(a => a.trim() !== '').length} of {questions.length} answered
                                </p>
                                <div className="progress">
                                    <div
                                        className="progress-bar bg-danger"
                                        style={{
                                            width: `${(Object.values(answers).filter(a => a.trim() !== '').length / questions.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Quiz Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to submit this quiz preview?</p>
                    <p className="text-muted">
                        You have answered {Object.values(answers).filter(a => a.trim() !== '').length} out of {questions.length} questions.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={confirmSubmit}>
                        Submit Preview
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
