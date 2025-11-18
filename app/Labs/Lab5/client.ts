import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

// ---------------- WELCOME ----------------
export const fetchWelcomeMessage = async () => {
  const response = await axios.get(`${HTTP_SERVER}/lab5/welcome`);
  return response.data;
};

// ---------------- ASSIGNMENT ----------------
const ASSIGNMENT_API = `${HTTP_SERVER}/lab5/assignment`;

export const fetchAssignment = async () => {
  const response = await axios.get(`${ASSIGNMENT_API}`);
  return response.data;
};

export const updateTitle = async (title: string) => {
  const response = await axios.get(`${ASSIGNMENT_API}/title/${title}`);
  return response.data;
};

// ---------------- TODOS ----------------
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TODOS_API = `${HTTP_SERVER}/lab5/todos`;

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(TODOS_API);
  return response.data;
};

export const removeTodo = async (todo: Todo): Promise<Todo[]> => {
  const response = await axios.get(`${TODOS_API}/${todo.id}/delete`);
  return response.data;
};


export const createNewTodo = async () => {
  const response = await axios.get(`${TODOS_API}/create`);
  return response.data;
};


export const postNewTodo = async (todo: Omit<Todo, "id">) => {
  const response = await axios.post(`${TODOS_API}`, todo);
  return response.data;
};

export const deleteTodo = async (todo: Todo) => {
  const response = await axios.delete(`${TODOS_API}/${todo.id}`);
  return response.data;
};


export const updateTodo = async (todo: Todo) => {
  const response = await axios.put(`${TODOS_API}/${todo.id}`, todo);
  return response.data;
};


