import * as types from "./types";
import catchError from "../../hoc/catchError";

import { projects } from "../../axios/main";

export const get_all_projects = ({ page, limit }, enqueueSnackbar) => {
  return catchError(async (dispatch) => {
    const { data } = await projects.get("/", {
      params: {
        page,
        limit,
      },
    });
    dispatch({ type: types.set_projects, projects: data });

    return data.total;
  }, enqueueSnackbar);
};

export const get_project = ({ project_id }, enqueueSnackbar) => {
  return catchError(async (dispatch) => {
    const { data } = await projects.get(`/${project_id}/`);
    dispatch({ type: types.set_project, project: data[0] });
  }, enqueueSnackbar);
};
