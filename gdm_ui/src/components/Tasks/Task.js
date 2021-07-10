import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Close, Save, Delete, AddBox } from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

import * as creators from "../../store/actions/index";
import Picker from "../DatePicker/DatePicker";
import roles from "../../defaults/roles.json";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  formControl: {
    margin: theme.spacing(1, 0),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Task = ({
  projectId,
  role,
  open,
  setOpen,
  task,
  me,
  members,
  teams,
  create_task,
  update_task,
  delete_task,
  isNew,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [title, set_title] = useState(task && task.title);
  const [deadline, set_deadline] = useState(task && task.deadline);
  const [assigned_to_team, set_assigned_to_team] = useState(
    task && task.assigned_to_team && task.assigned_to_team.id
  );
  const [assigned_to, set_assigned_to] = useState(
    task && task.assigned_to && task.assigned_to.id
  );

  const fn_map = {
    title: set_title,
    deadline: set_deadline,
    assigned_to: set_assigned_to,
    assigned_to_team: set_assigned_to_team,
  };

  const handleField = (e) => {
    const k = e.target.name;
    const v = e.target.value;

    fn_map[k]?.(v);
  };

  useEffect(() => {
    set_title(task && task.title);
    set_deadline(task && task.deadline);
    set_assigned_to_team(
      task && task.assigned_to_team && task.assigned_to_team.id
    );
    set_assigned_to(task && task.assigned_to && task.assigned_to.id);
  }, [task]);

  const handleClose = () => {
    setOpen?.(false);
  };

  const saveTask = async () => {
    if (role === roles.team_member) {
      set_assigned_to(me.id);
    }

    if (role === roles.team_manager) {
      set_assigned_to_team(Array.isArray(teams) && teams[0] && teams[0].id);
    }

    const res = await update_task(
      {
        task_id: task && task.id,
        title,
        deadline,
        assigned_to,
        assigned_to_team,
      },
      enqueueSnackbar
    );
    if (res !== false) handleClose();
  };

  const deleteTask = async () => {
    const res = await delete_task(task && task.id, enqueueSnackbar);
    if (res !== false) handleClose();
  };

  const createTask = async () => {
    if (role === roles.team_member) {
      set_assigned_to(me.id);
    }

    if (role === roles.team_manager) {
      set_assigned_to_team(Array.isArray(teams) && teams[0] && teams[0].id);
    }

    const res = await create_task(
      {
        project_id: projectId,
        title,
        deadline,
        assigned_to,
        assigned_to_team,
      },
      enqueueSnackbar
    );
    if (res !== false) handleClose();
  };

  const canChange = task && task.creator && me && task.creator.id === me.id;

  let buttons;
  if (canChange) {
    if (task) {
      buttons = (
        <>
          <IconButton color="inherit" aria-label="save" onClick={saveTask}>
            <Save />
          </IconButton>
          <IconButton color="inherit" aria-label="delete" onClick={deleteTask}>
            <Delete />
          </IconButton>
        </>
      );
    } else {
      buttons = (
        <IconButton color="inherit" aria-label="add" onClick={createTask}>
          <AddBox />
        </IconButton>
      );
    }
  }

  let fields;
  if (role === roles.project_manager) {
    fields = (
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          variant="outlined"
          fullWidth
          value={title}
          onChange={handleField}
        />
        <Picker
          name="deadline"
          label="Deadline"
          variant="outlined"
          fullWidth
          value={deadline}
          onChange={handleField}
        />
        <FormControl
          className={classes.formControl}
          variant="outlined"
          fullWidth
        >
          <InputLabel id="team">Team</InputLabel>
          <Select
            labelId="team"
            name="assigned_to_team"
            label="Team"
            value={assigned_to_team}
            onChange={handleField}
          >
            {Array.isArray(teams) &&
              teams.map((team) => {
                return (
                  <MenuItem value={team.id} key={team.id}>
                    {team.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <FormControl
          className={classes.formControl}
          variant="outlined"
          fullWidth
        >
          <InputLabel id="member">Member</InputLabel>
          <Select
            labelId="member"
            name="assigned_to"
            label="Member"
            value={assigned_to}
            onChange={handleField}
          >
            {Array.isArray(members) &&
              members.map((member) => {
                return (
                  <MenuItem value={member.id} key={member.id}>
                    {`${member.first_name} ${member.last_name}`}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </DialogContent>
    );
  } else if (role === roles.team_manager) {
    fields = (
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          variant="outlined"
          fullWidth
          value={title}
          onChange={handleField}
        />
        <Picker
          name="deadline"
          label="Deadline"
          variant="outlined"
          fullWidth
          value={deadline}
          onChange={handleField}
        />
        <FormControl
          className={classes.formControl}
          variant="outlined"
          fullWidth
        >
          <InputLabel id="member">Member</InputLabel>
          <Select
            labelId="member"
            name="assigned_to"
            label="Member"
            value={assigned_to}
            onChange={handleField}
          >
            {Array.isArray(members) &&
              members.map((member) => {
                return (
                  <MenuItem value={member.id} key={member.id}>
                    {`${member.first_name} ${member.last_name}`}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </DialogContent>
    );
  } else if (role === roles.team_member) {
    fields = (
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          variant="outlined"
          fullWidth
          value={title}
          onChange={handleField}
        />
        <Picker
          name="deadline"
          label="Deadline"
          variant="outlined"
          fullWidth
          value={deadline}
          onChange={handleField}
        />
      </DialogContent>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {isNew ? "New Task" : task && task.title}
          </Typography>
          {buttons}
        </Toolbar>
      </AppBar>
      {fields}
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    task: state.task,
    me: state.me,
    teams: state.teams,
    members: state.members,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    create_task: (
      { project_id, title, deadline, assigned_to, assigned_to_team },
      enqueueSnackbar
    ) =>
      dispatch(
        creators.create_task(
          { project_id, title, deadline, assigned_to, assigned_to_team },
          enqueueSnackbar
        )
      ),
    update_task: (
      { task_id, title, deadline, assigned_to, assigned_to_team },
      enqueueSnackbar
    ) =>
      dispatch(
        creators.update_task(
          { task_id, title, deadline, assigned_to, assigned_to_team },
          enqueueSnackbar
        )
      ),
    delete_task: (task_id, enqueueSnackbar) =>
      dispatch(creators.delete_task({ task_id }, enqueueSnackbar)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Task);
