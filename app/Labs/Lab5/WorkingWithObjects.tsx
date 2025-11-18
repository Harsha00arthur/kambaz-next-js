"use client";

import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
  // Assignment object
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  // Module object state (client side)
  const [moduleObj, setModuleObj] = useState({
    name: "Intro to Web Dev",
    description: "Learn basics of React and Node.js",
  });

  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      {/* -------- UPDATE ASSIGNMENT TITLE -------- */}
      <h4>Modifying Assignment</h4>

      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title
      </a>

      <FormControl
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <hr />

      {/* -------- UPDATE SCORE -------- */}
      <h4>Update Assignment Score</h4>

      <a
        id="wd-update-assignment-score"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
      >
        Update Score
      </a>

      <FormControl
        className="w-25"
        id="wd-assignment-score"
        type="number"
        defaultValue={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: parseInt(e.target.value) })
        }
      />
      <hr />

      {/* -------- UPDATE COMPLETED -------- */}
      <h4>Update Completed</h4>

      <a
        id="wd-update-assignment-completed"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
      >
        Update Completed
      </a>

      <input
        id="wd-assignment-completed"
        type="checkbox"
        className="form-check-input me-2"
        checked={assignment.completed}
        onChange={(e) =>
          setAssignment({ ...assignment, completed: e.target.checked })
        }
      />
      Completed?
      <hr />

      {/* -------- RETRIEVE ASSIGNMENT -------- */}
      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignment"
        className="btn btn-primary"
        href={`${ASSIGNMENT_API_URL}`}
      >
        Get Assignment
      </a>
      <hr />

      {/* -------- RETRIEVE TITLE -------- */}
      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${ASSIGNMENT_API_URL}/title`}
      >
        Get Title
      </a>
      <hr />

      {/* -------------------------------------------
           MODULE SECTION
      --------------------------------------------*/}
      <h3>Working With Modules</h3>

      <h4>Retrieving Module</h4>
      <a
        id="wd-get-module"
        className="btn btn-primary"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>

      <hr />

      <h4>Retrieving Module Name</h4>
      <a
        id="wd-get-module-name"
        className="btn btn-primary"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>

      <hr />

      {/* -------- UPDATE MODULE NAME -------- */}
      <h4>Update Module Name</h4>
      <a
        id="wd-update-module-name"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/name/${moduleObj.name}`}
      >
        Update Module Name
      </a>

      <FormControl
        className="w-75"
        id="wd-module-name"
        defaultValue={moduleObj.name}
        onChange={(e) =>
          setModuleObj({ ...moduleObj, name: e.target.value })
        }
      />
      <hr />

      {/* -------- UPDATE MODULE DESCRIPTION -------- */}
      <h4>Update Module Description</h4>
      <a
        id="wd-update-module-description"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/description/${moduleObj.description}`}
      >
        Update Description
      </a>

      <FormControl
        className="w-75"
        id="wd-module-description"
        defaultValue={moduleObj.description}
        onChange={(e) =>
          setModuleObj({ ...moduleObj, description: e.target.value })
        }
      />

      <hr />
    </div>
  );
}
