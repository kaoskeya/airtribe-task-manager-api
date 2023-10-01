import Bun from "bun";
import { isBoolean, sortBy } from "lodash";

type TaskInput = {
  title: string;
  description: string;
  priority: string;
  done: boolean;
};

type TaskBase = {
  id: number;
  created_at: Date;
  updated_at: Date;
};

type Task = TaskInput & TaskBase;
export type FilterPriority = "low" | "medium" | "high";

let TASKS: Array<TaskInput & Task> | undefined = undefined;
let TASK_COUNT: number | undefined = undefined;

const readFile = async () => {
  if (TASKS === undefined) {
    const TASKS_FILE = await Bun.file("tasks.json", {
      type: "application/json",
    }).json();
    TASKS = TASKS_FILE.TASKS || [];
    TASK_COUNT = TASKS_FILE.TASK_COUNT || 0;
  }
};

const writeFile = async () => {
  await Bun.write(
    "tasks.json",
    JSON.stringify({
      TASKS,
      TASK_COUNT,
    })
  );
};

export const readAll: (arg0: {
  filter_done?: boolean;
  filter_priority?: FilterPriority;
  sort_field?: "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
}) => Promise<Array<Task>> = async (args) => {
  await readFile();
  const filtered_tasks = TASKS!
    .filter((t) => {
      if (isBoolean(args.filter_done)) {
        return t.done === args.filter_done;
      }
      return true;
    })
    .filter((t) => {
      if (args.filter_priority) {
        return t.priority === args.filter_priority;
      }
      return true;
    });

  const sorted_tasks = sortBy(filtered_tasks, args.sort_field || "id");

  return args.sort_order && args.sort_order === "asc"
    ? sorted_tasks
    : sorted_tasks.reverse();
};

export const readById: (id: number) => Promise<Task> = async (id) => {
  await readFile();
  const task = TASKS!.find((t) => t.id === id);
  if (!task) {
    throw new Error(`Task ${id} not found`);
  }
  return task;
};

export const create: (task: TaskInput) => Promise<Task> = async (task) => {
  await readFile();
  const newTask = {
    id: ++TASK_COUNT!,
    done: task.done || false,
    priority: task.priority || "medium",
    title: task.title,
    description: task.description,
    created_at: new Date(),
    updated_at: new Date(),
  };
  TASKS!.push(newTask);
  await writeFile();
  return newTask;
};

export const update: (id: number, task: TaskInput) => Promise<Task> = async (
  id,
  task
) => {
  await readFile();
  const index = TASKS!.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Task ${id} not found`);
  }
  const updatedTask = {
    ...TASKS![index],
    ...task,
    updated_at: new Date(),
  };
  TASKS![index] = updatedTask;
  await writeFile();
  return updatedTask;
};

export const _delete: (id: number) => Promise<void> = async (id) => {
  await readFile();
  const index = TASKS!.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Task ${id} not found`);
  }
  TASKS!.splice(index, 1);
  await writeFile();
};
