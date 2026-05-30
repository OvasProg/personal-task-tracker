export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
}

export class Task {
  public id: string;
  public title: string;
  public description: string;
  public priority: Priority;
  public dueDate: Date;

  constructor(data: TaskData) {
    if (!data.title || data.title.trim() === "") {
      throw new Error("Title cannot be empty");
    }

    if (!Object.values(Priority).includes(data.priority)) {
      throw new Error("Invalid priority");
    }

    if (data.dueDate < new Date()) {
      const now = new Date();
      if (data.dueDate.getTime() < now.getTime() - 1000) {
        throw new Error("Due date cannot be in the past");
      }
    }

    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.dueDate = data.dueDate;
  }
}
