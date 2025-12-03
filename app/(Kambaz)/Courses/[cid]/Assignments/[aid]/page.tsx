"use client";
import { Button, Form } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addAssignment,
  updateAssignment as updateReduxAssignment,
} from "../../Assignments/reducer";
import { RootState } from "../../../../store";
import { useState, useEffect } from "react";

import * as client from "../../Assignments/client";

type AssignmentType = {
  _id?: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFromDate?: string;
  availableUntilDate?: string;
};

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid?: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );

  const existingAssignment =
    assignments.find((a: AssignmentType) => a._id === aid) || undefined;

  const [assignment, setAssignment] = useState<AssignmentType>({
    _id: existingAssignment?._id,
    title: existingAssignment?.title || "",
    course: existingAssignment?.course || (cid as string),
    description: existingAssignment?.description || "",
    points: existingAssignment?.points || 0,
    dueDate: existingAssignment?.dueDate || "",
    availableFromDate: existingAssignment?.availableFromDate || "",
    availableUntilDate: existingAssignment?.availableUntilDate || "",
  });

  // If opened directly with an aid and Redux is empty, fetch from server
  useEffect(() => {
    const loadAssignment = async () => {
      if (!aid || existingAssignment) return;
      try {
        const fetched = await client.fetchAssignmentById(aid as string);
        setAssignment(fetched);
        dispatch(updateReduxAssignment(fetched));
      } catch (e) {
        console.error(e);
      }
    };
    loadAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aid, existingAssignment]);

  useEffect(() => {
    if (existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, [existingAssignment]);

  const handleSave = async () => {
    try {
      let saved;

      if (assignment._id) {
        // UPDATE existing
        saved = await client.updateAssignment(assignment);
        dispatch(updateReduxAssignment(saved));
      } else {
        // CREATE new: don't send _id, let MongoDB create it
        const { _id, ...rest } = assignment;
        const toCreate = { ...rest, course: cid as string };
        saved = await client.createAssignment(cid as string, toCreate);
        dispatch(addAssignment(saved));
      }

      router.push(`/Courses/${cid}/Assignments`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

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

            {[
              "Text Entry",
              "Website URL",
              "Media Recordings",
              "Student Annotation",
              "File Upload",
            ].map((label, i) => (
              <div className="form-check" key={i}>
                <input className="form-check-input" type="checkbox" id={label} />
                <label className="form-check-label" htmlFor={label}>
                  {label}
                </label>
              </div>
            ))}
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

        {/* Available Dates */}
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
