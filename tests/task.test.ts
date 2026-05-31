import { Task, Priority } from "../src/models/task";

describe("Task Entity", () => {
  const validData = {
    id: "1",
    title: "Test Task",
    description: "This is a test description",
    priority: Priority.MEDIUM,
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
  };

  describe("Success Cases", () => {
    it("should successfully instantiate a Task with valid data", () => {
      const task = new Task(validData);
      expect(task).toBeDefined();
      expect(task.id).toBe(validData.id);
      expect(task.title).toBe(validData.title);
    });

    it("should maintain the correct priority level", () => {
      const highTask = new Task({ ...validData, priority: Priority.HIGH });
      expect(highTask.priority).toBe(Priority.HIGH);
    });
  });

  describe("Validation Errors", () => {
    it("should throw an error if the title is empty", () => {
      const invalidData = { ...validData, title: "" };
      expect(() => new Task(invalidData)).toThrow("Title cannot be empty");
    });

    it("should throw an error if the priority is invalid", () => {
      // Testing type safety/runtime validation
      const invalidData = { ...validData, priority: "URGENT" as any };
      expect(() => new Task(invalidData)).toThrow("Invalid priority");
    });

    it("should throw an error if the due date is in the past", () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      const invalidData = { ...validData, dueDate: pastDate };
      expect(() => new Task(invalidData)).toThrow(
        "Due date cannot be in the past",
      );
    });
  });
});
