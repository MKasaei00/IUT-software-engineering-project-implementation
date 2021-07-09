import axios from "axios";
const api_url = "http://localhost:8000";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

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

auth.defaults.xsrfCookieName = "csrftoken";
auth.defaults.xsrfHeaderName = "X-CSRFToken";
tasks.defaults.xsrfCookieName = "csrftoken";
tasks.defaults.xsrfHeaderName = "X-CSRFToken";
projects.defaults.xsrfCookieName = "csrftoken";
projects.defaults.xsrfHeaderName = "X-CSRFToken";
