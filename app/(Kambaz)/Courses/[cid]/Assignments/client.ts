import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

// Correct REST endpoints
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

// Assignment type
export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFromDate?: string;
  availableUntilDate?: string;
}

/* ---------------------------------------------
   FETCH ALL assignments for a specific course
---------------------------------------------- */
export const fetchAssignmentsByCourse = async (
  cid: string
): Promise<Assignment[]> => {
  const { data } = await axios.get(`${COURSES_API}/${cid}/assignments`);
  return data;
};

/* ---------------------------------------------
   CREATE new assignment for a specific course
---------------------------------------------- */
export const createAssignment = async (
  cid: string,
  assignment: Assignment
): Promise<Assignment> => {
  const { data } = await axios.post(
    `${COURSES_API}/${cid}/assignments`,
    assignment
  );
  return data;
};

/* ---------------------------------------------
   FETCH one assignment
---------------------------------------------- */
export const fetchAssignmentById = async (
  aid: string
): Promise<Assignment> => {
  const { data } = await axios.get(`${ASSIGNMENTS_API}/${aid}`);
  return data;
};

/* ---------------------------------------------
   UPDATE one assignment
---------------------------------------------- */
export const updateAssignment = async (
  assignment: Assignment
): Promise<Assignment> => {
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return data;
};

/* ---------------------------------------------
   DELETE assignment
---------------------------------------------- */
export const deleteAssignment = async (
  aid: string
): Promise<{ success: boolean }> => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${aid}`);
  return data;
};
