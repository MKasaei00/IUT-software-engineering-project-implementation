const catchError = (fn, err) => {
  return (dispatch, getState) => {
    return fn(dispatch, getState).catch(err);
  };
};

export default catchError;
