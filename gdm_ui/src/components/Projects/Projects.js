import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Container,
  Typography,
  Badge,
  Button,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { Person, Assignment } from "@material-ui/icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import * as creators from "../../store/actions/index";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  button: {
    flexGrow: 1,
    textAlign: "right",
  },
}));

const Projects = (props) => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const limit = 10;

  const getProjects = async (page = 1) => {
    const total = await props.get_all_projects({ page, limit }, () => {});
    const count = Math.ceil(total / limit);
    setCount(count);
  };

  const changePage = (e, value) => {
    if (value < 1 || value > count || value === page) return;
    setPage(value);
    getProjects(value);
  };

  useEffect(() => {
    getProjects();
  });

  return (
    <Container className={classes.root} maxWidth="md">
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="center"
        justify="center"
      >
        {Array.isArray(props.projects) &&
          props.projects.map((project) => {
            return (
              <Grid item xs={12} key={project.id}>
                <Paper className={classes.paper} elevation={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="h6">{project.title}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {moment(project.deadline).format("YYYY/MM/DD hh:mm:ss")}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={3}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item>
                      <Badge
                        badgeContent={project.members || 0}
                        showZero
                        color="secondary"
                      >
                        <Person />
                      </Badge>
                    </Grid>
                    <Grid item>
                      <Badge
                        badgeContent={project.tasks || 0}
                        showZero
                        color="secondary"
                      >
                        <Assignment />
                      </Badge>
                    </Grid>
                    <Grid item className={classes.button}>
                      <Link to={`/${project.id}`}>
                        <Button variant="outlined" color="primary">
                          go to project
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        <Grid item>
          {count > 1 && (
            <Pagination
              count={count}
              page={page}
              onChange={changePage}
              variant="outlined"
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    get_all_projects: ({ page, limit, search }, err) =>
      dispatch(creators.get_all_projects({ page, limit, search }, err)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
