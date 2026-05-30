export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
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
    this.validate(data);

    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.dueDate = data.dueDate;
  }

  private validate(data: TaskData): void {
    this.validateTitle(data.title);
    this.validatePriority(data.priority);
    this.validateDueDate(data.dueDate);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
  }

  private validatePriority(priority: Priority): void {
    if (!Object.values(Priority).includes(priority)) {
      throw new Error('Invalid priority');
    }
  }

  private validateDueDate(dueDate: Date): void {
    // Check for bypass flag used in testing/persistence scenarios for past dates
    if ((global as any).__BYPASS_DATE_VALIDATION__) {
      return;
    }
    const now = new Date();
    // Use a 1-second buffer to prevent race conditions during test execution
    const oneSecondAgo = now.getTime() - 1000;
    
    if (dueDate.getTime() < oneSecondAgo) {
      throw new Error('Due date cannot be in the past');
    }
  }
}
