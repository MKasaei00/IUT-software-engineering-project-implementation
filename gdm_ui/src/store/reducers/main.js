import * as types from "../actions/types";

const initState = {
  me: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.set_me:
      return { ...state, me: action.me };
    default:
      return state;
  }
};

export default reducer;
