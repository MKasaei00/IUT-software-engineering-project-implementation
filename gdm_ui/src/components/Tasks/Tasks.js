import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Container,
  Typography,
  IconButton,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { Close, Check, MoreVert } from "@material-ui/icons";
import { red, green, yellow } from "@material-ui/core/colors";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

import Timer from "../Timer/Timer";
import Task from "./Task";
import task_status from "../../defaults/task.json";

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
  red: {
    color: red[500],
  },
  green: {
    color: green[500],
  },
  yellow: {
    color: yellow[900],
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Tasks = (props) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const limit = 10;

  const getTasks = async (page = 1) => {
    const total = await props.get_all_tasks(
      { page, limit, project_id: props.projectId, role: props.role },
      enqueueSnackbar
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

  const viewTask = async (task_id) => {
    const res = await props.get_task(task_id, enqueueSnackbar);
    if (res !== false) setOpen(true);
  };
  const cancelTask = (task_id) => {
    props.cancel_task(task_id, enqueueSnackbar);
  };
  const completeTask = (task_id) => {
    props.complete_task(task_id, enqueueSnackbar);
  };
  return (
    <Container className={classes.root} maxWidth="md">
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item style={{ width: "100%" }}>
          <Grid container spacing={3}>
            {Array.isArray(props.tasks) &&
              props.tasks.map((task) => {
                return (
                  <Grid item xs={12} lg={3} md={4} sm={6} key={task.id}>
                    <Card className={classes.root}>
                      <CardContent>
                        <Typography
                          className={classes.title}
                          variant="h6"
                          gutterBottom
                        >
                          {task.title}
                        </Typography>
                        <Timer
                          deadline={
                            Array.isArray(task.deadlines) &&
                            task.deadlines[0] &&
                            task.deadlines[0].end_date
                          }
                        />
                      </CardContent>
                      <CardActions className={classes.buttons}>
                        <IconButton
                          aria-label="close"
                          className={classes.yellow}
                          onClick={cancelTask.bind(null, task.id)}
                        >
                          <Close />
                        </IconButton>
                        <IconButton
                          aria-label="check"
                          className={classes.green}
                          onClick={completeTask.bind(null, task.id)}
                        >
                          <Check />
                        </IconButton>
                        <IconButton
                          aria-label="view"
                          onClick={viewTask.bind(null, task.id)}
                        >
                          <MoreVert />
                        </IconButton>
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
      <Task
        open={open}
        setOpen={setOpen}
        projectId={props.projectId}
        role={props.role}
      />
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
    get_all_tasks: ({ project_id, role, page, limit }, enqueueSnackbar) =>
      dispatch(
        creators.get_all_tasks(
          { page, limit, project_id, role },
          enqueueSnackbar
        )
      ),
    get_task: (task_id, enqueueSnackbar) =>
      dispatch(creators.get_task({ task_id }, enqueueSnackbar)),
    complete_task: (task_id, enqueueSnackbar) =>
      dispatch(creators.complete_task({ task_id }, enqueueSnackbar)),
    cancel_task: (task_id, enqueueSnackbar) =>
      dispatch(creators.cancel_task({ task_id }, enqueueSnackbar)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
