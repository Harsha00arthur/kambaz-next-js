"use client";
import { Button, Form } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment } from "../../Assignments/reducer";
import { RootState } from "../../../../store";
import * as db from "../../../../Database";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// ✅ Define assignment type
type AssignmentType = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFromDate?: string;
  availableUntilDate?: string;
};

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );

  // ✅ Determine if editing or adding
  const existingAssignment =
    assignments.find((a) => a._id === aid) ||
    (db.assignments.find(
      (a: unknown) => (a as AssignmentType)._id === aid
    ) as AssignmentType | undefined);

  // ✅ Local editable state
  const [assignment, setAssignment] = useState<AssignmentType>({
    _id: existingAssignment?._id || uuidv4(),
    title: existingAssignment?.title || "",
    course: existingAssignment?.course || cid,
    description: existingAssignment?.description || "",
    points: existingAssignment?.points || 0,
    dueDate: existingAssignment?.dueDate || "",
    availableFromDate: existingAssignment?.availableFromDate || "",
    availableUntilDate: existingAssignment?.availableUntilDate || "",
  });

  // ✅ Save handler
  const handleSave = () => {
    if (existingAssignment) {
      dispatch(updateAssignment(assignment));
    } else {
      dispatch(addAssignment({ ...assignment, course: cid }));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  // ✅ Cancel handler (no changes applied)
  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  // ✅ Sync state if existing assignment changes (optional safeguard)
  useEffect(() => {
    if (existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, [existingAssignment]);

  return (
    <div id="wd-assignments-editor">
      <Form>
        {/* Assignment Name */}
        <div className="mb-3 row">
          <label htmlFor="wd-name" className="form-label">
            Assignment Name
          </label>
          <div>
            <input
              type="text"
              id="wd-name"
              value={assignment.title}
              onChange={(e) =>
                setAssignment({ ...assignment, title: e.target.value })
              }
              className="form-control"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-3 row">
          <label htmlFor="wd-description" className="form-label">
            Description
          </label>
          <div>
            <textarea
              id="wd-description"
              rows={6}
              value={assignment.description}
              onChange={(e) =>
                setAssignment({ ...assignment, description: e.target.value })
              }
              className="form-control"
            ></textarea>
          </div>
        </div>

        {/* Points */}
        <div className="mb-3 row">
          <label htmlFor="wd-points" className="col-sm-2 col-form-label">
            Points
          </label>
          <div className="col-sm-10">
            <input
              type="number"
              id="wd-points"
              value={assignment.points}
              onChange={(e) =>
                setAssignment({
                  ...assignment,
                  points: Number(e.target.value),
                })
              }
              className="form-control"
            />
          </div>
        </div>

        {/* Assignment Group */}
        <div className="mb-3 row">
          <label htmlFor="wd-group" className="col-sm-2 col-form-label">
            Assignment Group
          </label>
          <div className="col-sm-10">
            <select id="wd-group" className="form-select">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            </select>
          </div>
        </div>

        {/* Display Grades */}
        <div className="mb-3 row">
          <label
            htmlFor="wd-display-grade-as"
            className="col-sm-2 col-form-label"
          >
            Display Grades as
          </label>
          <div className="col-sm-10">
            <select id="wd-display-grade-as" className="form-select">
              <option value="Percentage">Percentage</option>
            </select>
          </div>
        </div>

        {/* Submission Type */}
        <div className="mb-3 row">
          <label
            htmlFor="wd-submission-type"
            className="col-sm-2 col-form-label"
          >
            Submission Type
          </label>
          <div className="col-sm-10">
            <select id="wd-submission-type" className="form-select">
              <option value="Online">Online</option>
            </select>
            <p className="mt-2 mb-1">Online entry option</p>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-text-entry"
                className="form-check-input"
              />
              <label
                htmlFor="wd-text-entry"
                className="form-check-label"
              >
                Text Entry
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-website-url"
                className="form-check-input"
                defaultChecked
              />
              <label
                htmlFor="wd-website-url"
                className="form-check-label"
              >
                Website URL
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-media-recordings"
                className="form-check-input"
              />
              <label
                htmlFor="wd-media-recordings"
                className="form-check-label"
              >
                Media Recordings
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-student-annotation"
                className="form-check-input"
              />
              <label
                htmlFor="wd-student-annotation"
                className="form-check-label"
              >
                Student Annotation
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="wd-file-upload"
                className="form-check-input"
              />
              <label
                htmlFor="wd-file-upload"
                className="form-check-label"
              >
                File Upload
              </label>
            </div>
          </div>
        </div>

        {/* Assign To */}
        <div className="mb-3 row">
          <label htmlFor="wd-assign-to" className="col-sm-2 col-form-label">
            Assign to
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              id="wd-assign-to"
              value="Everyone"
              readOnly
              className="form-control"
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-3 row">
          <label htmlFor="wd-due-date" className="col-sm-2 col-form-label">
            Due
          </label>
          <div className="col-sm-10">
            <input
              type="date"
              id="wd-due-date"
              value={assignment.dueDate}
              onChange={(e) =>
                setAssignment({ ...assignment, dueDate: e.target.value })
              }
              className="form-control"
            />
          </div>
        </div>

        {/* Available From & Until */}
        <div className="mb-3 row">
          <label
            htmlFor="wd-available-from"
            className="col-sm-2 col-form-label"
          >
            Available from
          </label>
          <div className="col-sm-4">
            <input
              type="date"
              id="wd-available-from"
              value={assignment.availableFromDate}
              onChange={(e) =>
                setAssignment({
                  ...assignment,
                  availableFromDate: e.target.value,
                })
              }
              className="form-control"
            />
          </div>

          <label
            htmlFor="wd-available-until"
            className="col-sm-2 col-form-label"
          >
            Until
          </label>
          <div className="col-sm-4">
            <input
              type="date"
              id="wd-available-until"
              value={assignment.availableUntilDate}
              onChange={(e) =>
                setAssignment({
                  ...assignment,
                  availableUntilDate: e.target.value,
                })
              }
              className="form-control"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
