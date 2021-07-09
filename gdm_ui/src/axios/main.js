import axios from "axios";
const api_url = "http://localhost:8000";

export const auth = axios.create({
  baseURL: `${api_url}/rest-auth`,
  withCredentials: true,
});

export const tasks = axios.create({
  baseURL: `${api_url}/api/tasks`,
  withCredentials: true,
});

export const projects = axios.create({
  baseURL: `${api_url}/api/projects`,
  withCredentials: true,
});
