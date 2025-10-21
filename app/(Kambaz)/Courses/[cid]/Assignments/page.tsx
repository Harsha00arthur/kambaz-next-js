"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import * as db from "../../../Database"; // adjust the path if needed
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import AssignmentsControls from "./AssignmentsControls";

type Assignment = {
  _id: string;
  title: string;
  course: string;
  available?: string;
  due?: string;
  points?: number;
};

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>(); 
  const assignments = db.assignments.filter(
    (a: Assignment) => a.course === cid
  );

  return (
    <div id="wd-assignments">
      {/* Top bar: Search + Buttons */}
      <AssignmentsControls />

      {/* Assignment Groups */}
      <ListGroup id="wd-assignment-groups" className="rounded-0">
        {/* Assignment Group: Assignments 40% */}
        <ListGroupItem className="wd-assignment-group p-0 mb-4 border-gray">
          <div
            id="wd-assignments-title"
            className="d-flex justify-content-between align-items-center p-3 ps-2 bg-secondary-subtle"
          >
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <span className="fw-bold">ASSIGNMENTS</span>
            </div>

            <div className="d-flex align-items-center">
              <Badge bg="secondary" pill className="me-2">
                40% of Total
              </Badge>
              <ModuleControlButtons />
            </div>
          </div>

          {/* Assignment List */}
          <ListGroup id="wd-assignment-list" className="rounded-0">
            {assignments.map((a) => (
              <ListGroupItem
                key={a._id}
                as={Link}
                href={`/Courses/${cid}/Assignments/${a._id}`}
                action
                className="wd-assignment-list-item p-3 ps-1 d-flex justify-content-between"
              >
                <div>
                  <BsGripVertical className="me-2 fs-3" />
                  <Link
                    href={`/Courses/${cid}/Assignments/${a._id}`}
                    className="wd-assignment-link fw-bold"
                  >
                    {a.title}
                  </Link>
                  <p className="mb-0 text-muted small">
                    <span className="text-danger">Multiple modules</span> |{" "}
                    <b>Not available until</b> May 6 at 12:00 am | <b>Due</b>{" "}
                    May 13 at 11:59 pm | 100 pts
                  </p>
                </div>
                <LessonControlButtons />
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
