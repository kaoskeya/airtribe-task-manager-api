// requires/imports
import express from "express";

// modules
import tasks from "./modules/tasks";

// constants/defaults
const PORT = process.env.PORT || 3000; // run on env var PORT or default to 3000

// init
const app = express();
app.use(express.json()); // parse JSON bodies
app.use("/tasks", tasks);

// set up routes
app.get("/", (req, res) => {
  res.json({
    message:
      "This is the Task Manager API, but you probably want to go to /tasks",
  });
});

// listen up
app.listen(PORT, (error) => {
  if (error) {
    console.error("There was an error", error);
    return;
  }
  console.log(`Task Manager API is running on port ${PORT}`);
});
