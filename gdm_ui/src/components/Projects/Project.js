import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

import Tasks from "../Tasks/Tasks";

import * as creators from "../../store/actions/index";

const Project = (props) => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const { id } = useParams();
  const query = useQuery();

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    props.get_project({ project_id: id }, enqueueSnackbar);
  }, []);

  return (
    <div>
      <Tasks projectId={id} role={query.get("role")} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    project: state.project,
    tasks: state.tasks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    get_project: ({ project_id }, enqueueSnackbar) =>
      dispatch(creators.get_project({ project_id }, enqueueSnackbar)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
