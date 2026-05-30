import { Task, Priority } from '../models/task';

export interface SortStrategy {
  sort(tasks: Task[]): Task[];
}

export class SortByDateStrategy implements SortStrategy {
  sort(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }
}

export class SortByPriorityStrategy implements SortStrategy {
  private priorityMap: Record<Priority, number> = {
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
  };

  sort(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      return this.priorityMap[b.priority] - this.priorityMap[a.priority];
    });
  }
}
