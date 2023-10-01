import { Router, Response } from "express";
import {
  createValidator,
  ValidatedRequestSchema,
  ValidatedRequest,
  ContainerTypes,
} from "express-joi-validation";
import {
  readAll,
  readById,
  create,
  update,
  _delete,
} from "../../datasource/tasks/in-memory";
import { getTaskSchema, postTaskSchema, putTaskSchema } from "./schema";

const validator = createValidator({});

// init
const router = Router();

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
  (req: ValidatedRequest<GetTasksRequestSchema>, res: Response) => {
    const tasks = readAll({
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
  (req: ValidatedRequest<GetTasksRequestSchema>, res: Response) => {
    const tasks = readAll({
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
router.get("/:id", (req, res) => {
  try {
    const task = readById(Number(req.params.id));
    res.status(201).json({ task });
  } catch (e) {
    res.status(404).json({ message: `Task ${req.params.id} not found` });
  }
});

// Create a new task
router.post("/", validator.body(postTaskSchema), (req, res) => {
  try {
    const task = create({
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
router.put("/:id", validator.body(putTaskSchema), (req, res) => {
  try {
    const task = update(Number(req.params.id), req.body);
    res.status(201).json({ task });
  } catch (e) {
    res
      .status(404)
      .json({ message: `There was an error while updating the task` });
  }
});

// Delete a task by its ID
router.delete("/:id", (req, res) => {
  try {
    _delete(Number(req.params.id));
    res.status(204).json();
  } catch (e) {
    res
      .status(404)
      .json({ message: `There was an error while deleting the task` });
  }
});

export default router;
