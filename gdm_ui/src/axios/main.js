import axios from "axios";
const api_url = "http://localhost:8000";

export const users = axios.create({
  baseURL: `${api_url}/users`,
});

export const auth = axios.create({
  baseURL: `${api_url}/rest-auth`,
});

export const tasks = axios.create({
  baseURL: `${api_url}/tasks`,
});

export const projects = axios.create({
  baseURL: `${api_url}/projects`,
});
