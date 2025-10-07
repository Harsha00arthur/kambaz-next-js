"use client";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";

export default function AssignmentsControls() {
  return (
    <div id="wd-assignments-controls" className="d-flex justify-content-between mb-3">
      {/* Search box */}
      <InputGroup style={{ maxWidth: "300px" }}>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          id="wd-search-assignment"
          placeholder="Search for Assignments"
        />
      </InputGroup>

      {/* Buttons */}
      <div>
        <Button
          id="wd-add-assignment-group"
          variant="secondary"
          className="me-2"
        >
          <FaPlus className="me-1" /> Group
        </Button>
        <Button
          id="wd-add-assignment"
          variant="danger"
        >
          <FaPlus className="me-1" /> Assignment
        </Button>
      </div>
    </div>
  );
}
