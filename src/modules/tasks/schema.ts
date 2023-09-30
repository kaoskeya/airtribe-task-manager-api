import Joi from "joi";

// constants/defaults
const PRIORITIES = ["low", "medium", "high"];
const DEFAULT_PRIORITY = "medium";

export const getTaskSchema = Joi.object({
  filter_done: Joi.boolean(),
  filter_priority: Joi.string().valid(...PRIORITIES),
  sort_field: Joi.string().valid("created_at", "updated_at"),
  sort_order: Joi.string().valid("asc", "desc").default("asc"),
});

export const postTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .valid(...PRIORITIES)
    .default(DEFAULT_PRIORITY),
  done: Joi.boolean(),
});

export const putTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .required()
    .valid(...PRIORITIES),
  done: Joi.boolean().required(),
});
