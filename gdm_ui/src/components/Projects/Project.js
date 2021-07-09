import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";

import Tasks from "../Tasks/Tasks";

import * as creators from "../../store/actions/index";

const Project = (props) => {
  const { id } = useParams();
  useEffect(() => {
    props.get_project({ project_id: id }, () => {});
  }, []);

  return (
    <div>
      <Tasks projectId={id} />
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
    get_project: ({ project_id }, err) =>
      dispatch(creators.get_project({ project_id }, err)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
