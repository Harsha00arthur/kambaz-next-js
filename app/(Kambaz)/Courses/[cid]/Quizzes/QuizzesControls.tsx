"use client";

import { Button, FormControl, InputGroup, Dropdown } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addQuiz } from "./reducer";
import * as client from "./client";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import type { User } from "../../../Account/client";



export default function QuizzesControls() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector(
  (state: RootState) => state.accountReducer.currentUser as User | null
);
  const isFaculty = currentUser?.role === "FACULTY";


  const handleAddQuiz = async () => {
    if (!cid) return;

    try {
      const newQuiz = await client.createQuiz(cid as string, {
        title: "New Quiz",
        course: cid as string,
        published: false,
        points: 0,
        questionsCount: 0,
      });
      dispatch(addQuiz(newQuiz));
      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      id="wd-quizzes-controls"
      className="d-flex justify-content-between mb-3"
    >
      {/* Search box (not fully wired, optional) */}
      <InputGroup style={{ maxWidth: "300px" }}>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <FormControl placeholder="Search for Quizzes" />
      </InputGroup>

      <div className="d-flex gap-2">
        {/* Optional sort dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary" size="sm">
            Sort
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>By Name</Dropdown.Item>
            <Dropdown.Item>By Due Date</Dropdown.Item>
            <Dropdown.Item>By Available Date</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Add Quiz */}
        {isFaculty && (
          <Button variant="danger" onClick={handleAddQuiz}>
          <FaPlus className="me-1" /> Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
