import axios from "axios";
const api_url = "https://e5a85339-0e1b-4505-958d-f481ed069903.mock.pstmn.io";

export const users = axios.create({
  baseURL: `${api_url}/users`,
});

export const tasks = axios.create({
  baseURL: `${api_url}/tasks`,
});

export const projects = axios.create({
  baseURL: `${api_url}/projects`,
});
