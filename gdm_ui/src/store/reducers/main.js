import * as types from "../actions/types";

const initState = {
  me: null,
  projects: [],
  project: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.set_me:
      return { ...state, me: action.me };
    case types.set_projects:
      return { ...state, projects: action.projects };
    case types.set_project:
      return { ...state, project: action.project };
    default:
      return state;
  }
};

export default reducer;
