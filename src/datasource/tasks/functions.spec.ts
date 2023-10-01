import { expect, test, describe } from "bun:test";
import { _delete, create, readAll, readById, update } from "./in-memory";

describe("Tasks DataSource", () => {
  test("should return empty array when no tasks", () => {
    // setup
    const expected: [] = [];

    // exercise
    const tasks = readAll({});

    // verify
    expect(tasks).toEqual(expected);
  });

  test("should throw an error while fetching by a task by id that doesn't exist", () => {
    // setup
    const id = 123;

    // exercise
    const task = () => readById(id);

    // verify
    expect(task).toThrow();
  });

  test("should throw an error while upddating a task by id that doesn't exist", () => {
    // setup
    const id = 123;

    // exercise
    const task = () =>
      update(id, {
        title: "My Task",
        description: "My Description",
        done: false,
        priority: "medium",
      });

    // verify
    expect(task).toThrow();
  });

  test("should throw an error while deleting a task by id that doesn't exist", () => {
    // setup
    const id = 123;

    // exercise
    const task = () => _delete(id);

    // verify
    expect(task).toThrow();
  });

  test("should create a task", () => {
    // setup
    const expected = {
      title: "My Task",
      description: "My Description",
      done: false,
      priority: "medium",
    };

    // exercise
    const task = create({
      title: "My Task",
      description: "My Description",
      done: false,
      priority: "medium",
    });

    // verify
    expect(task).toMatchObject(expected);
    expect(task.id).toBe(1);
  });

  test("should return array with 1 item, after a task is created", () => {
    // setup
    const expected = 1;

    // exercise
    const tasks = readAll({});

    // verify
    expect(tasks.length).toEqual(expected);
  });

  test("should return appropriate number of tasks when fetching by certain filters", () => {
    // setup
    const expected = {
      filter_priority_low: 0,
      filter_priority_medium: 1,
      filter_priority_high: 0,
      filter_done_true: 0,
      filter_done_false: 1,
    };

    // exercise
    const filter_priority_low = readAll({ filter_priority: "low" });
    const filter_priority_medium = readAll({ filter_priority: "medium" });
    const filter_priority_high = readAll({ filter_priority: "high" });
    const filter_done_true = readAll({ filter_done: true });
    const filter_done_false = readAll({ filter_done: false });

    // verify
    expect(filter_priority_low.length).toEqual(expected.filter_priority_low);
    expect(filter_priority_medium.length).toEqual(
      expected.filter_priority_medium
    );
    expect(filter_priority_high.length).toEqual(expected.filter_priority_high);
    expect(filter_done_true.length).toEqual(expected.filter_done_true);
    expect(filter_done_false.length).toEqual(expected.filter_done_false);
  });

  test("should allow to update task by id", () => {
    // setup
    const id = 1;
    const expected = {
      title: "Updated Title",
      description: "Updated Description",
      done: true,
      priority: "high",
    };

    // exercise
    const task = update(id, {
      title: "Updated Title",
      description: "Updated Description",
      done: true,
      priority: "high",
    });

    // verify
    expect(task).toMatchObject(expected);
  });

  test("should return appropriate number of tasks when fetching by certain filters after completing a task and setting priority to high", () => {
    // setup
    const expected = {
      filter_priority_low: 0,
      filter_priority_medium: 0,
      filter_priority_high: 1,
      filter_done_true: 1,
      filter_done_false: 0,
    };

    // exercise
    const filter_priority_low = readAll({ filter_priority: "low" });
    const filter_priority_medium = readAll({ filter_priority: "medium" });
    const filter_priority_high = readAll({ filter_priority: "high" });
    const filter_done_true = readAll({ filter_done: true });
    const filter_done_false = readAll({ filter_done: false });

    // verify
    expect(filter_priority_low.length).toEqual(expected.filter_priority_low);
    expect(filter_priority_medium.length).toEqual(
      expected.filter_priority_medium
    );
    expect(filter_priority_high.length).toEqual(expected.filter_priority_high);
    expect(filter_done_true.length).toEqual(expected.filter_done_true);
    expect(filter_done_false.length).toEqual(expected.filter_done_false);
  });

  test("should create three more tasks", () => {
    // setup
    const expected = 4;

    // exercise
    create({
      title: "My Task",
      description: "My Description",
      done: false,
      priority: "low",
    });
    create({
      title: "My Task",
      description: "My Description",
      done: false,
      priority: "medium",
    });
    create({
      title: "My Task",
      description: "My Description",
      done: false,
      priority: "high",
    });
    const tasks = readAll({});

    // verify
    expect(tasks.length).toBe(expected);
  });

  test("should allow to delete a task by id", () => {
    // setup
    const id = 2;
    const expected = 3;

    // exercise
    _delete(id);
    const tasks = readAll({});

    // verify
    expect(tasks.length).toBe(expected);
  });

  test("should use a new unused id, if creating a task after deleting an old one", () => {
    // setup
    const expected_length = 4;
    const expected_id = 5;

    // exercise
    const task = create({
      title: "My Task",
      description: "My Description",
      done: false,
      priority: "medium",
    });
    const tasks = readAll({});

    // verify
    expect(task.id).toBe(expected_id);
    expect(tasks.length).toBe(expected_length);
  });

  test("should return appropriate number of tasks when fetching by certain filters after completing a task and setting priority to high", () => {
    // setup
    const expected = {
      filter_priority_low: 0,
      filter_priority_medium: 2,
      filter_priority_high: 2,
      filter_done_true: 1,
      filter_done_false: 3,
    };

    // exercise
    const filter_priority_low = readAll({ filter_priority: "low" });
    const filter_priority_medium = readAll({ filter_priority: "medium" });
    const filter_priority_high = readAll({ filter_priority: "high" });
    const filter_done_true = readAll({ filter_done: true });
    const filter_done_false = readAll({ filter_done: false });

    // verify
    expect(filter_priority_low.length).toEqual(expected.filter_priority_low);
    expect(filter_priority_medium.length).toEqual(
      expected.filter_priority_medium
    );
    expect(filter_priority_high.length).toEqual(expected.filter_priority_high);
    expect(filter_done_true.length).toEqual(expected.filter_done_true);
    expect(filter_done_false.length).toEqual(expected.filter_done_false);
  });
});
