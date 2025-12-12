"use client";

import { Button, FormControl, InputGroup, Dropdown } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import type { User } from "../../../Account/client";

import * as client from "./client";
import {
  addQuiz,
  setSearch,
  setSort,
} from "./reducer";

export default function QuizzesControls() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state: RootState) => state.accountReducer.currentUser as User | null
  );
  const isFaculty = currentUser?.role === "FACULTY";

  // ---------------- ADD QUIZ ----------------
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

      // ✅ go straight to editor
      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/Editor`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      id="wd-quizzes-controls"
      className="d-flex justify-content-between mb-3"
    >
      {/* 🔍 SEARCH */}
      <InputGroup style={{ maxWidth: "300px" }}>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>

        <FormControl
          placeholder="Search for Quizzes"
          onChange={(e) =>
            dispatch(setSearch(e.target.value))
          }
        />
      </InputGroup>

      <div className="d-flex gap-2">
        {/* 🔃 SORT */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary" size="sm">
            Sort
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => dispatch(setSort("NAME"))}
            >
              By Name
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => dispatch(setSort("DUE"))}
            >
              By Due Date
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => dispatch(setSort("AVAILABLE"))}
            >
              By Available Date
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* ➕ ADD QUIZ */}
        {isFaculty && (
          <Button variant="danger" onClick={handleAddQuiz}>
            <FaPlus className="me-1" /> Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
