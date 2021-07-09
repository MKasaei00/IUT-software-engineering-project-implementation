import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Container,
  Typography,
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { Person, Assignment } from "@material-ui/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";

import Timer from "../Timer/Timer";

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

const Tasks = (props) => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const limit = 10;

  const getTasks = async (page = 1) => {
    const total = await props.get_all_tasks(
      { page, limit, project_id: props.projectId },
      () => {}
    );
    const count = Math.ceil(total / limit);
    setCount(count);
  };

  const changePage = (e, value) => {
    if (value < 1 || value > count || value === page) return;
    setPage(value);
    getTasks(value);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container className={classes.root} maxWidth="md">
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Grid container spacing={3}>
            {Array.isArray(props.tasks) &&
              props.tasks.map((task) => {
                return (
                  <Grid item>
                    <Card className={classes.root}>
                      <CardContent>
                        <Typography
                          className={classes.title}
                          color="textSecondary"
                          gutterBottom
                        >
                          {task.title}
                        </Typography>
                        <Timer deadline={task.deadline} />
                        <Typography
                          className={classes.pos}
                          color="textSecondary"
                        >
                          adjective
                        </Typography>
                        <Typography variant="body2" component="p">
                          well meaning and kindly.
                          <br />
                          {'"a benevolent smile"'}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn More</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
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
    tasks: state.tasks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    get_all_tasks: ({ project_id, page, limit, search }, err) =>
      dispatch(
        creators.get_all_tasks({ page, limit, search, project_id }, err)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
