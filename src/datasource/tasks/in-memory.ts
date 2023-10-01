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

const TASKS: Array<TaskInput & Task> = [];
let TASK_COUNT = 0;

export const readAll: (arg0: {
  filter_done?: boolean;
  filter_priority?: FilterPriority;
  sort_field?: "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
}) => Promise<Array<Task>> = async (args) => {
  const filtered_tasks = TASKS.filter((t) => {
    if (isBoolean(args.filter_done)) {
      return t.done === args.filter_done;
    }
    return true;
  }).filter((t) => {
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
  const task = TASKS.find((t) => t.id === id);
  if (!task) {
    throw new Error(`Task ${id} not found`);
  }
  return task;
};

export const create: (task: TaskInput) => Promise<Task> = async (task) => {
  const newTask = {
    id: ++TASK_COUNT,
    done: task.done || false,
    priority: task.priority || "medium",
    title: task.title,
    description: task.description,
    created_at: new Date(),
    updated_at: new Date(),
  };
  TASKS.push(newTask);
  return newTask;
};

export const update: (id: number, task: TaskInput) => Promise<Task> = async (
  id,
  task
) => {
  const index = TASKS.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Task ${id} not found`);
  }
  const updatedTask = {
    ...TASKS[index],
    ...task,
    updated_at: new Date(),
  };
  TASKS[index] = updatedTask;
  return updatedTask;
};

export const _delete: (id: number) => Promise<void> = async (id) => {
  const index = TASKS.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Task ${id} not found`);
  }
  TASKS.splice(index, 1);
};
