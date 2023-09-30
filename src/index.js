// requires/imports
const express = require("express");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const { sortBy, isBoolean } = require("lodash");

// constants/defaults
const PORT = process.env.PORT || 3000; // run on env var PORT or default to 3000
const TASKS = [];
const PRIORITIES = ["low", "medium", "high"];
const DEFAULT_PRIORITY = "medium";

// init
const app = express();

app.use(express.json()); // parse JSON bodies

// set up routes
app.get("/", (req, res) => {
  res.json({
    message:
      "This is the Task Manager API, but you probably want to go to /tasks",
  });
});

const getTaskSchema = Joi.object({
  filter_done: Joi.boolean(),
  filter_priority: Joi.string().valid(...PRIORITIES),
  sort_field: Joi.string().valid("created_at", "updated_at"),
  sort_order: Joi.string().valid("asc", "desc").default("asc"),
});

// Retrieve all tasks
app.get("/tasks", validator.query(getTaskSchema), (req, res) => {
  const { filter_done, filter_priority, sort_field, sort_order } = req.query;
  // filter first
  const filtered_tasks = TASKS.filter((t) => {
    if (isBoolean(filter_done)) {
      return t.done === filter_done;
    }
    return true;
  }).filter((t) => {
    if (filter_priority) {
      return t.priority === filter_priority;
    }
    return true;
  });
  // sort next
  const sorted_tasks = sortBy(filtered_tasks, sort_field || "id");
  res.json({
    tasks:
      sort_order && sort_order === "asc" // reverse if sort_order is desc
        ? sorted_tasks
        : sorted_tasks.reverse(),
  });
});

// Retrieve a single task by its ID
app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const task = TASKS.find((t) => t.id === id);
  if (!task) {
    res.status(404).json({ message: `Task ${id} not found` });
    return;
  }
  res.json({ task });
});

const postTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .valid(...PRIORITIES)
    .default(DEFAULT_PRIORITY),
  done: Joi.boolean(),
});

// Create a new task
app.post("/tasks", validator.body(postTaskSchema), (req, res) => {
  const { title, description } = req.body;
  const newTask = {
    id: `${TASKS.length + 1}`,
    title,
    description,
    priority: DEFAULT_PRIORITY,
    done: false,
    created_at: new Date(),
    updated_at: new Date(),
  };
  TASKS.push(newTask);
  res.status(201).json({ task: newTask });
});

const putTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .required()
    .valid(...PRIORITIES),
  done: Joi.boolean().required(),
});

// Update an existing task by its ID
app.put("/tasks/:id", validator.body(putTaskSchema), (req, res) => {
  const { id } = req.params;
  const task_index = TASKS.findIndex((t) => t.id === id);
  if (task_index === -1) {
    res.status(404).json({ message: `Task ${id} not found` });
    return;
  }
  let task = TASKS[task_index];
  // update the values
  task = { ...task, ...req.body, updated_at: new Date() };
  // update the value back in the TASKS array
  TASKS[task_index] = task;
  res.json({ task });
});

// Delete a task by its ID
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const task_index = TASKS.findIndex((t) => t.id === id);
  if (task_index === -1) {
    res.status(404).json({ message: `Task ${id} not found` });
    return;
  }
  TASKS.splice(task_index, 1);
  res.json({ message: `Task ${id} deleted` });
});

// listen, no?
app.listen(PORT, (error) => {
  if (error) {
    console.error("There was an error", error);
    return;
  }
  console.log(`Task Manager API is running on port ${PORT}`);
});
