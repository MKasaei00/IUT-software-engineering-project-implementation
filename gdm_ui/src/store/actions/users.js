import * as types from "./types";
import catchError from "../../hoc/catchError";

import { auth } from "../../axios/main";

export const get_me = (err) => {
  return catchError(async (dispatch) => {
    const { data } = await auth.get("/user/");
    dispatch({ type: types.set_me, me: data });
  }, err);
};

export const login = ({ email, password }, err) => {
  return catchError(async () => {
    const { data } = await auth.post("/login/", { email, password });
    return data;
  }, err);
};

export const logout = (err) => {
  return catchError(async (dispatch) => {
    const { data } = await auth.get("/logout/");
    dispatch({ type: types.set_me, me: null });
    return data;
  }, err);
};
