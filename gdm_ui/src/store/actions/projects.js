import * as types from "./types";
import catchError from "../../hoc/catchError";

import { projects } from "../../axios/main";

export const get_all_projects = ({ page, limit, search }, err) => {
  return catchError(async (dispatch) => {
    const { data } = await projects.get("/", {
      params: {
        page,
        limit,
        search,
      },
    });
    dispatch({ type: types.set_projects, projects: data.projects });

    return data.total;
  }, err);
};

export const get_project = ({ project_id }, err) => {
  return catchError(async (dispatch) => {
    const { data } = await projects.get(`/${project_id}`);
    dispatch({ type: types.set_project, project: data.project });
  }, err);
};
