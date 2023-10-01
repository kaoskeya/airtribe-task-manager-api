import { Router, Response } from "express";
import {
  createValidator,
  ValidatedRequestSchema,
  ValidatedRequest,
  ContainerTypes,
} from "express-joi-validation";
import * as tasksInMemoryDatasource from "../../datasource/tasks/in-memory";
import * as tasksFileDatasource from "../../datasource/tasks/file";
import { getTaskSchema, postTaskSchema, putTaskSchema } from "./schema";

const validator = createValidator({});

// init
const router = Router();

const { readAll, readById, create, update, _delete } =
  process.env.TASKS_DATASOURCE === "file"
    ? tasksFileDatasource
    : tasksInMemoryDatasource;

interface GetTasksRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    filter_done?: boolean;
    sort_field?: "created_at" | "updated_at";
    sort_order?: "asc" | "desc";
  };
  [ContainerTypes.Params]: {
    level: "low" | "medium" | "high";
  };
}

// Retrieve all tasks
router.get(
  "/",
  validator.query(getTaskSchema),
  async (req: ValidatedRequest<GetTasksRequestSchema>, res: Response) => {
    const tasks = await readAll({
      filter_done: req.query.filter_done,
      sort_field: req.query.sort_field,
      sort_order: req.query.sort_order,
    });
    res.status(201).json({
      tasks,
    });
  }
);

// Retrieve tasks by priority
router.get(
  "/priority/:level",
  validator.query(getTaskSchema),
  async (req: ValidatedRequest<GetTasksRequestSchema>, res: Response) => {
    const tasks = await readAll({
      filter_done: req.query.filter_done,
      sort_field: req.query.sort_field,
      sort_order: req.query.sort_order,
      filter_priority: req.params.level,
    });
    res.status(201).json({
      tasks,
    });
  }
);

// Retrieve a single task by its ID
router.get("/:id", async (req, res) => {
  try {
    const task = await readById(Number(req.params.id));
    res.status(201).json({ task });
  } catch (e) {
    res.status(404).json({ message: `Task ${req.params.id} not found` });
  }
});

// Create a new task
router.post("/", validator.body(postTaskSchema), async (req, res) => {
  try {
    const task = await create({
      ...req.body,
    });
    res.status(201).json({ task });
  } catch (e) {
    res
      .status(500)
      .json({ message: `There was an error while creating the task` });
  }
});

// Update an existing task by its ID
router.put("/:id", validator.body(putTaskSchema), async (req, res) => {
  try {
    const task = await update(Number(req.params.id), req.body);
    res.status(201).json({ task });
  } catch (e) {
    res
      .status(404)
      .json({ message: `There was an error while updating the task` });
  }
});

// Delete a task by its ID
router.delete("/:id", async (req, res) => {
  try {
    await _delete(Number(req.params.id));
    res.status(204).json();
  } catch (e) {
    res
      .status(404)
      .json({ message: `There was an error while deleting the task` });
  }
});

export default router;
