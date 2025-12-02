import axios from "axios";

const axiosWithCredentials = axios.create({
  withCredentials: true,
});

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const USERS_API = `${HTTP_SERVER}/api/users`;

export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};


export const findUsersByRole = async (role: string) => {
  const response = await
    axios.get(`${USERS_API}?role=${role}`);
  return response.data;
};

export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(`${USERS_API}?name=${name}`);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get(`${USERS_API}/${id}`);
  return response.data;
};


export const deleteUser = async (userId: string) => {
  const response = await axios.delete( `${USERS_API}/${userId}` );
  return response.data;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUser = async (user: any) => {
  const response = await axios.post(`${USERS_API}`, user);
  return response.data;
};



export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  [key: string]: unknown;
}

export interface SignupUser {
  username: string;
  password: string;
  [key: string]: unknown; // allow extra fields
}

export const signin = async (credentials: Credentials): Promise<User> => {
  const response = await axiosWithCredentials.post<User>(
    `${USERS_API}/signin`,
    credentials
  );
  return response.data;
};

export const signup = async (user: SignupUser): Promise<User> => {
  const response = await axiosWithCredentials.post<User>(
    `${USERS_API}/signup`,
    user
  );
  return response.data;
};


export const updateUser = async (user: User): Promise<User> => {
  const response = await axiosWithCredentials.put<User>(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};






export const profile = async (): Promise<User | null> => {
  const response = await axiosWithCredentials.post<User | null>(
    `${USERS_API}/profile`
  );
  return response.data;
};

export const signout = async (): Promise<{ message: string }> => {
  const response = await axiosWithCredentials.post<{ message: string }>(
    `${USERS_API}/signout`
  );
  return response.data;
};
