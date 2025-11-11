"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, Badge, Button, Modal } from "react-bootstrap";
import { BsGripVertical, BsTrash } from "react-icons/bs";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import AssignmentsControls from "./AssignmentsControls";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "../Assignments/reducer";
import { useState } from "react";

// ✅ Explicitly define Assignment type
interface Assignment {
  _id: string;
  title: string;
  course: string;
  available?: string;
  due?: string;
  points?: number;
  availableFromDate?: string;
  availableUntilDate?: string;
  dueDate?: string;
}

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();

  // ✅ Strongly type assignments from Redux
  const assignments = useSelector(
    (state: RootState) => state.assignmentsReducer.assignments
  ) as Assignment[];

  const courseAssignments = assignments.filter(
    (a: Assignment) => a.course === cid
  );

  // ✅ For confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleDelete = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedAssignment) {
      dispatch(deleteAssignment(selectedAssignment._id));
    }
    setShowConfirm(false);
  };

  return (
    <div id="wd-assignments">
      <AssignmentsControls />

      <ListGroup id="wd-assignment-groups" className="rounded-0">
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
              <ModuleControlButtons
                moduleId={cid || ""}
                deleteModule={() => {}}
                editModule={() => {}}
              />
            </div>
          </div>

          <ListGroup id="wd-assignment-list" className="rounded-0">
            {courseAssignments.map((a) => (
              <ListGroupItem
                key={a._id}
                action
                className="wd-assignment-list-item p-3 ps-1 d-flex justify-content-between align-items-center"
              >
                <div className="flex-grow-1">
                  <BsGripVertical className="me-2 fs-3" />
                  <Link
                    href={`/Courses/${cid}/Assignments/${a._id}`}
                    className="wd-assignment-link fw-bold"
                  >
                    {a.title}
                  </Link>
                  <p className="mb-0 text-muted small">
                    <span className="text-danger">Multiple modules</span> |{" "}
                    <b>Not available until</b>{" "}
                    {a.availableFromDate ?? "—"} | <b>Due</b>{" "}
                    {a.dueDate ?? "—"} | {a.points ?? 0} pts
                  </p>
                </div>

                {/* ✅ Delete Button (Trash Icon) */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(a)}
                  className="ms-3"
                >
                  <BsTrash />
                </Button>

                <LessonControlButtons />
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>

      {/* ✅ Confirmation Dialog */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedAssignment?.title}</strong>?
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
