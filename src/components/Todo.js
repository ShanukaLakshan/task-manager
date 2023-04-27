import React, { useState, useEffect, Fragment } from "react";
import {
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  Switch,
  Typography,
  TextField,
} from "@mui/material";

import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// librryselecter for sorting tasks
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "",
    dueDate: dayjs(date).format("DD-MM-YYYY"),
    done: false,
  });

  const [editingTask, setEditingTask] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [editingIndex, setEditingIndex] = useState(null);
  const [notification, setNotification] = useState("");
  const [sortTasks, setSortTasks] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);

  const { title, description, status, dueDate } = taskData;

  const [sortDate, setSortDate] = useState("");

  const sort_tasks = () => {
    const sortedTasks = tasks.slice().sort((a, b) => {
      const dateA = dayjs(a.dueDate, "DD-MM-YYYY");
      const dateB = dayjs(b.dueDate, "DD-MM-YYYY");
      if (sortDate) {
        return dateA.diff(dateB);
      } else {
        return dateB.diff(dateA);
      }
    });
    return sortedTasks;
  };

  const handleChange = (event) => {
    setSortDate(event.target.value);
    setTasks(sort_tasks());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() || description.trim() || status.trim() || dueDate.trim()) {
      if (editingTask !== null) {
        setTasks(
          tasks.map((task, index) =>
            index === editingTask
              ? { ...task, title, description, status, dueDate }
              : task
          )
        );
        setEditingTask(null);
        setTaskData({
          title: "",
          description: "",
          status: "",
          dueDate: dayjs(date).format("DD-MM-YYYY"),
          done: false,
        });
      } else {
        setTasks([...tasks, taskData]);
        setTaskData({
          title: "",
          description: "",
          status: "",
          dueDate: dayjs(date).format("DD-MM-YYYY"),
          done: false,
        });
        setNotification("Task added successfully!");
        setTimeout(() => {
          setNotification("");
        }, 2000);
      }
    }
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    setNotification("Item Deleted Successfully");
    setTimeout(() => {
      setNotification("");
    }, 2000);

    if (index === editingIndex) {
      setEditingTask(null); // reset editingTask and editingIndex when a task is deleted
      setEditingIndex(null);
    }
  };

  const handleEdit = (index) => {
    setEditingTask(index);
    setTaskData(tasks[index]);
    setEditingIndex(index);
  };

  const handleDone = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
    setNotification("Task status updated successfully!");
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setTasks(sort_tasks());
  }, [taskData]);

  return (
    <div className="container">
      {notification && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={true}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {notification}
          </Alert>
        </Snackbar>
      )}

      <Typography variant="h4" align="center" mt={3} mb={4}>
        Total completed tasks: {tasks.filter((task) => task.done).length}
      </Typography>

      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="sort_by_date">Sort by date</InputLabel>
        <Select
          style={{ width: "200px" }}
          id="sort_by_date"
          value={sortDate}
          label="Sort by date"
          onChange={handleChange}
        >
          <MenuItem value={true}>Ascending</MenuItem>
          <MenuItem value={false}>Descending</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="sort_by_tasks">Sort by tasks</InputLabel>
        <Select
          style={{ width: "200px" }}
          id="sort_by_tasks"
          value={sortTasks}
          label="Sort by tasks"
          onChange={(e) => {
            setSortTasks(e.target.value);
          }}
        >
          <MenuItem value={null}>All Tasks</MenuItem>
          <MenuItem value={false}>Pending Tasks</MenuItem>
          <MenuItem value={true}>Completed Tasks</MenuItem>
        </Select>
      </FormControl>

      <form onSubmit={handleSubmit}>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{
            flexGrow: 1,
            background: "#B8E7E1",
            padding: 1,
            marginBottom: 5,
          }}
        >
          <Grid item xs="auto">
            <TextField
              label="Title"
              defaultValue="Title"
              size="small"
              value={title}
              name="title"
              onChange={(e) => onChange(e)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs="auto">
            <TextField
              label="Description"
              defaultValue="Description"
              size="small"
              value={description}
              name="description"
              onChange={(e) => onChange(e)}
              fullWidth
            />
          </Grid>
          <Grid item xs="auto">
            <TextField
              label="Status"
              size="small"
              value={status}
              name="status"
              onChange={(e) => onChange(e)}
            />
          </Grid>
          <Grid item xs="auto">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                  setTaskData({
                    ...taskData,
                    dueDate: dayjs(newValue).format("DD-MM-YYYY"),
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3}>
            <CardActions>
              <Button type="submit" variant="outlined" color="primary">
                {editingTask !== null ? "Update" : "Add"}
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </form>

      <div className="row">
        {tasks.map((task, index) =>
          task.done === sortTasks || sortTasks === null ? (
            <Fragment>
              <Dialog
                open={deletePrompt}
                onClose={() => setDeletePrompt(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure you want to delete this item?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={() => setDeletePrompt(false)}>No</Button>
                  <Button
                    onClick={() => {
                      setDeletePrompt(false);
                      handleDelete(index);
                    }}
                    autoFocus
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
              <div className="col-md-4" key={index}>
                <Card sx={{ mb: 3, p: 2 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Title : {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description : {task.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status : {task.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due Date : {task.dueDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.done ? "Completed" : "Pending"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setDeletePrompt(true)}
                    >
                      Delete
                    </Button>
                    <Switch
                      checked={task.done}
                      onChange={() => handleDone(index)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </CardActions>
                </Card>
              </div>
            </Fragment>
          ) : (
            <Fragment></Fragment>
          )
        )}
      </div>
    </div>
  );
};

export default Todo;
