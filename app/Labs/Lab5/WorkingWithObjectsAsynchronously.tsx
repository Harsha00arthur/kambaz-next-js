"use client";

import React, { useEffect, useState } from "react";
import * as client from "./client";
import { FormControl } from "react-bootstrap";

interface Assignment {
  id?: number;
  title?: string;
  description?: string;
  due?: string;
  completed?: boolean;
}

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<Assignment>({});

  const fetchAssignment = async () => {
    const assignment = await client.fetchAssignment();
    setAssignment(assignment);
  };

  const updateTitle = async (title: string) => {
    const updatedAssignment = await client.updateTitle(title);
    setAssignment(updatedAssignment);
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  return (
    <div id="wd-asynchronous-objects">
      <h3>Working with Objects Asynchronously</h3>
      <h4>Assignment</h4>

      {/* TITLE */}
      <FormControl
        defaultValue={assignment.title}
        className="mb-2"
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      {/* DESCRIPTION — must use textarea */}
      <FormControl
        as="textarea"
        rows={3}
        defaultValue={assignment.description}
        className="mb-2"
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />

      {/* DUE DATE */}
      <FormControl
        type="date"
        className="mb-2"
        defaultValue={assignment.due}
        onChange={(e) =>
          setAssignment({ ...assignment, due: e.target.value })
        }
      />

      {/* COMPLETED */}
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="wd-completed"
          defaultChecked={assignment.completed}
          onChange={(e) =>
            setAssignment({
              ...assignment,
              completed: e.target.checked,
            })
          }
        />
        <label className="form-check-label" htmlFor="wd-completed">
          Completed
        </label>
      </div>

      {/* UPDATE BUTTON */}
      <button
        className="btn btn-primary me-2"
        onClick={() => updateTitle(assignment.title ?? "")}
      >
        Update Title
      </button>

      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <hr />
    </div>
  );
}
