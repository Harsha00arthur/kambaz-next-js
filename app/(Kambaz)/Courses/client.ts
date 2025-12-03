import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

// Base API endpoints
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

/* -----------------------------------------------------
   MODULE FUNCTIONS
   ----------------------------------------------------- */

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

export const deleteModule = async (courseId: string, moduleId: string) => {
  const response = await axios.delete(
    `${COURSES_API}/${courseId}/modules/${moduleId}`
  );
  return response.data;
};

export const updateModule = async (courseId: string, module: ModuleInput) => {
  if (!module._id) {
    throw new Error("updateModule: module._id is required");
  }

  const { data } = await axios.put(
    `${COURSES_API}/${courseId}/modules/${module._id}`,
    module
  );

  return data;
};

/* -----------------------------------------------------
   COURSE FUNCTIONS
   ----------------------------------------------------- */

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

/* -----------------------------------------------------
   ENROLLMENT FUNCTIONS
   ----------------------------------------------------- */

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};

/* -----------------------------------------------------
   ⭐ REQUIRED NEW FEATURE: USERS ENROLLED IN A COURSE
   ----------------------------------------------------- */

export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};
