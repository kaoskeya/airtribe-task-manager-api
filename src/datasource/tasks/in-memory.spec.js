import { expect, test, describe } from "bun:test";
import { create, readAll, readById } from "./in-memory";

describe("InMemoryTaskDataSource", () => {
  test("should return empty array when no tasks", () => {
    // setup
    const expected = [];

    // exercise
    const tasks = readAll({});

    // verify
    expect(tasks).toEqual(expected);
  });

  test("should throw an error while fetching by an id that doesn't exist", () => {
    // setup
    const id = 123;

    // exercise
    const task = () => readById({ id });

    // verify
    expect(task).toThrow();
  });

  test("should create a task along with default values", () => {
    // setup
    const expected = {
      title: "My Task",
      description: "My Description",
    };

    // exercise
    const task = create({ title: "My Task", description: "My Description" });

    // verify
    expect(task).toMatchObject(expected);
    expect(task.id).toBe(1);
    expect(task.done).toBe(false);
    expect(task.priority).toBe("medium");
  });

  test("should return array with 1 item, after a task is created", () => {
    // setup
    const expected = 1;

    // exercise
    const tasks = readAll({});

    // verify
    expect(tasks.length).toEqual(expected);
  });
});
