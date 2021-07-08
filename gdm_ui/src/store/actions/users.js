import * as types from "./types";
import catchError from "../../hoc/catchError";

import { users } from "../../axios/main";

export const get_me = (err) => {
  return catchError(async (dispatch) => {
    const { data } = await users.get("/me");
    dispatch({ type: types.set_me, me: data.me });
  }, err);
};

export const login = (email, password, err) => {
  return catchError(async () => {
    const { data } = await users.post("/login", { email, password });
    return data;
  }, err);
};
