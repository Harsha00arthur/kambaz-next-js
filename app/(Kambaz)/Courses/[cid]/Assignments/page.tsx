import Link from "next/link";
import { ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import AssignmentsControls from "./AssignmentsControls";

export default function Assignments() {
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
            <ListGroupItem
              as={Link}
              href="/Courses/1234/Assignments/123"
              action
              className="wd-assignment-list-item p-3 ps-1 d-flex justify-content-between"
            >
              <div>
                <BsGripVertical className="me-2 fs-3" />
                <Link
                  href="/Courses/1234/Assignments/123"
                  className="wd-assignment-link fw-bold"
                >
                  A1
                </Link>
                <p className="mb-0 text-muted small">
                  <span className="text-danger">Multiple modules</span> |{" "}
                  <b>Not available until</b> May 6 at 12:00 am | <b>Due</b> May
                  13 at 11:59 pm | 100 pts
                </p>
              </div>
              <LessonControlButtons />
            </ListGroupItem>

            <ListGroupItem
              as={Link}
              href="/Courses/1234/Assignments/124"
              action
              className="wd-assignment-list-item p-3 ps-1 d-flex justify-content-between"
            >
              <div>
                <BsGripVertical className="me-2 fs-3" />
                <Link
                  href="/Courses/1234/Assignments/124"
                  className="wd-assignment-link fw-bold"
                >
                  A2
                </Link>
                <p className="mb-0 text-muted small">
                  <span className="text-danger">Multiple modules</span> |{" "}
                  <b>Not available until</b> May 13 at 12:00 am | <b>Due</b> May
                  20 at 11:59 pm | 100 pts
                </p>
              </div>
              <LessonControlButtons />
            </ListGroupItem>

            <ListGroupItem
              as={Link}
              href="/Courses/1234/Assignments/125"
              action
              className="wd-assignment-list-item p-3 ps-1 d-flex justify-content-between"
            >
              <div>
                <BsGripVertical className="me-2 fs-3" />
                <Link
                  href="/Courses/1234/Assignments/125"
                  className="wd-assignment-link fw-bold"
                >
                  A3
                </Link>
                <p className="mb-0 text-muted small">
                  <span className="text-danger">Multiple modules</span> |{" "}
                  <b>Not available until</b> May 20 at 12:00 am | <b>Due</b> May
                  27 at 11:59 pm | 100 pts
                </p>
              </div>
              <LessonControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
