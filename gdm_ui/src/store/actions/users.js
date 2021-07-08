import * as types from "./types";
import catchError from "../../hoc/catchError";

import { users } from "../../axios/main";

export const get_me = (err) => {
  return catchError(async (dispatch) => {
    const { data } = await users.get("/me");
    dispatch({ type: types.set_me, me: data.me });
  }, err);
};
