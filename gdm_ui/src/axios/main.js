import axios from "axios";
const api_url = "http://localhost:8000/api";

export const users = axios.create({
  baseURL: `${api_url}/users`,
});

export const tasks = axios.create({
  baseURL: `${api_url}/tasks`,
});

export const projects = axios.create({
  baseURL: `${api_url}/projects`,
});
