import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;

/* ---------------------- TYPES ---------------------- */

export interface LessonInput {
  _id?: string;
  name: string;
}

export interface ModuleInput {
  _id?: string;
  name: string;
  course?: string;
  lessons?: LessonInput[];
  [key: string]: unknown;
}

export interface CourseInput {
  _id?: string;
  name?: string;
  number?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  description?: string;
  [key: string]: unknown;
}

/* ------------------ MODULE FUNCTIONS ------------------ */

export const createModuleForCourse = async (
  courseId: string,
  module: ModuleInput
) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

/* ------------------ COURSE FUNCTIONS ------------------ */

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`
  );
  return data;
};

export const createCourse = async (course: CourseInput) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (course: CourseInput) => {
  if (!course._id || typeof course._id !== "string") {
    throw new Error("updateCourse: course._id must be a string");
  }

  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${course._id}`,
    course
  );
  return data;
};

/* ------------------ FIXED MODULE DELETE + UPDATE ------------------ */

const MODULES_API = `${HTTP_SERVER}/api/modules`;

export const deleteModule = async (moduleId: string) => {
  const response = await axios.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};

// 🔥 FULLY TYPED — NO ANY
export const updateModule = async (module: ModuleInput) => {
  if (!module._id || typeof module._id !== "string") {
    throw new Error("updateModule: module._id must be a string");
  }

  const response = await axios.put(
    `${MODULES_API}/${module._id}`,
    module
  );
  return response.data;
};
