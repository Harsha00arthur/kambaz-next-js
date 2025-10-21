"use client";
import { Button, Form } from "react-bootstrap";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as db from "../../../../Database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();

  // ✅ Use the richer dataset with description, points, and dates
  const assignment = db.assignmentsEditor.find(
    (a: {
      _id: string;
      title: string;
      course: string;
      description?: string;
      points?: number;
      dueDate?: string;
      availableFromDate?: string;
      availableUntilDate?: string;
    }) => a._id === aid
  );

  if (!assignment) {
    return <div>Assignment not found.</div>;
  }

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
              defaultValue={assignment.title}
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
              defaultValue={assignment.description}
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
              defaultValue={assignment.points}
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
          <label htmlFor="wd-display-grade-as" className="col-sm-2 col-form-label">
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
          <label htmlFor="wd-submission-type" className="col-sm-2 col-form-label">
            Submission Type
          </label>
          <div className="col-sm-10">
            <select id="wd-submission-type" className="form-select">
              <option value="Online">Online</option>
            </select>
            <p className="mt-2 mb-1">Online entry option</p>
            <div className="form-check">
              <input type="checkbox" id="wd-text-entry" className="form-check-input" />
              <label htmlFor="wd-text-entry" className="form-check-label">Text Entry</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="wd-website-url" className="form-check-input" defaultChecked />
              <label htmlFor="wd-website-url" className="form-check-label">Website URL</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="wd-media-recordings" className="form-check-input" />
              <label htmlFor="wd-media-recordings" className="form-check-label">Media Recordings</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="wd-student-annotation" className="form-check-input" />
              <label htmlFor="wd-student-annotation" className="form-check-label">Student Annotation</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="wd-file-upload" className="form-check-input" />
              <label htmlFor="wd-file-upload" className="form-check-label">File Upload</label>
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
              defaultValue="Everyone"
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
              defaultValue={assignment.dueDate}
              className="form-control"
            />
          </div>
        </div>

        {/* Available From & Until */}
        <div className="mb-3 row">
          <label htmlFor="wd-available-from" className="col-sm-2 col-form-label">
            Available from
          </label>
          <div className="col-sm-4">
            <input
              type="date"
              id="wd-available-from"
              defaultValue={assignment.availableFromDate}
              className="form-control"
            />
          </div>

          <label htmlFor="wd-available-until" className="col-sm-2 col-form-label">
            Until
          </label>
          <div className="col-sm-4">
            <input
              type="date"
              id="wd-available-until"
              defaultValue={assignment.availableUntilDate}
              className="form-control"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Link href={`/Courses/${cid}/Assignments`}>
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Link href={`/Courses/${cid}/Assignments`}>
            <Button variant="danger">Save</Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}
