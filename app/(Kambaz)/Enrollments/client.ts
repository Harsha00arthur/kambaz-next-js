import axios from "axios";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// -------------------------
// Get all enrollments
// -------------------------
export const fetchEnrollments = async () => {
  const { data } = await axios.get(`${API}/api/enrollments`);
  return data;
};

// -------------------------
// Enroll a user in a course
// -------------------------
export const enroll = async (user: string, course: string) => {
  const { data } = await axios.post(`${API}/api/enrollments`, {
    user,
    course,
  });
  return data;
};

// -------------------------
// Unenroll a user from course
// -------------------------
export const unenroll = async (user: string, course: string) => {
  const { data } = await axios.delete(
    `${API}/api/enrollments/${user}/${course}`
  );
  return data;
};
