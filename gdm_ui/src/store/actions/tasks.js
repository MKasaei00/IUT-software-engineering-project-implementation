import * as types from "./types";
import catchError from "../../hoc/catchError";

import { tasks, projects } from "../../axios/main";

export const get_all_tasks = ({ project_id, page, limit, search }, err) => {
  return catchError(async (dispatch) => {
    const { data } = await projects.get(`${project_id}/tasks/`, {
      params: {
        page,
        limit,
        search,
      },
    });
    dispatch({ type: types.set_tasks, tasks: data.tasks });

    return data.total;
  }, err);
};

export const get_task = ({ task_id }, err) => {
  return catchError(async (dispatch) => {
    const { data } = await tasks.get(`/${task_id}/`);
    dispatch({ type: types.set_task, task: data.task });
  }, err);
};
