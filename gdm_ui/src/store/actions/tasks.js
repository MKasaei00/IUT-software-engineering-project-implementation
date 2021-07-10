import * as types from "./types";
import catchError from "../../hoc/catchError";

import { tasks, projects } from "../../axios/main";

export const get_all_tasks = (
  { project_id, role, page, limit },
  enqueueSnackbar
) => {
  return catchError(async (dispatch) => {
    const { data } = await projects.get(`${project_id}/tasks/`, {
      params: {
        page,
        limit,
        role,
      },
    });
    dispatch({ type: types.set_tasks, tasks: data });

    return data.total;
  }, enqueueSnackbar);
};

export const get_task = ({ task_id }, enqueueSnackbar) => {
  return catchError(async (dispatch) => {
    const { data } = await tasks.get(`/${task_id}/`);
    dispatch({ type: types.set_task, task: data });
  }, enqueueSnackbar);
};
