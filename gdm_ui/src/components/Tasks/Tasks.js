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
import { Delete, Close, Check, MoreVert } from "@material-ui/icons";
import { red, green, yellow } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
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
  red: {
    color: red[500],
  },
  green: {
    color: green[500],
  },
  yellow: {
    color: yellow[500],
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
                          {task.status}
                        </Typography>
                      </CardContent>
                      <CardActions className={classes.buttons}>
                        <IconButton aria-label="delete" className={classes.red}>
                          <Delete />
                        </IconButton>
                        <IconButton
                          aria-label="close"
                          className={classes.yellow}
                        >
                          <Close />
                        </IconButton>
                        <IconButton
                          aria-label="check"
                          className={classes.green}
                        >
                          <Check />
                        </IconButton>
                        <IconButton aria-label="check">
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
