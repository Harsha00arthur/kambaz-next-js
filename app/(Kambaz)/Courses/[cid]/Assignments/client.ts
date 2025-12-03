"use client";

export type Assignment = {
  _id?: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFromDate?: string;
  availableUntilDate?: string;
};

const SERVER =
  process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

// GET all assignments for a course
export const fetchAssignmentsByCourse = async (cid: string): Promise<Assignment[]> => {
  const response = await fetch(`${SERVER}/api/courses/${cid}/assignments`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch assignments");
  }
  return response.json();
};

// GET one assignment by id
export const fetchAssignmentById = async (aid: string): Promise<Assignment> => {
  const response = await fetch(`${SERVER}/api/assignments/${aid}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch assignment");
  }
  return response.json();
};

// CREATE new assignment for a course
export const createAssignment = async (
  cid: string,
  assignment: Omit<Assignment, "_id">
): Promise<Assignment> => {
  const response = await fetch(`${SERVER}/api/courses/${cid}/assignments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignment),
  });
  if (!response.ok) {
    throw new Error("Failed to create assignment");
  }
  return response.json();
};

// UPDATE existing assignment
export const updateAssignment = async (
  assignment: Assignment
): Promise<Assignment> => {
  if (!assignment._id) {
    throw new Error("Assignment _id is required for update");
  }
  const response = await fetch(
    `${SERVER}/api/assignments/${assignment._id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update assignment");
  }
  return response.json();
};

// DELETE assignment
export const deleteAssignment = async (aid: string): Promise<boolean> => {
  const response = await fetch(`${SERVER}/api/assignments/${aid}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete assignment");
  }
  const result = await response.json();
  return !!result.success;
};
