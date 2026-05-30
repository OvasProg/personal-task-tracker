import { Task, Priority, TaskData } from '../models/task';
import { StorageAdapter } from '../storage/adapter';
import { SortStrategy } from '../patterns/strategy';

export class TaskService {
  constructor(private storage: StorageAdapter<Task>) {}

  async createTask(title: string, description: string, priority: Priority, dueDate: Date): Promise<Task> {
    const id = Math.random().toString(36).substring(2, 11);
    const newTask = new Task({ id, title, description, priority, dueDate });
    const tasks = await this.storage.read();
    tasks.push(newTask);
    await this.storage.write(tasks);
    return newTask;
  }

  async getAllTasks(): Promise<Task[]> {
    const rawTasks = await this.storage.read();
    // Re-instantiate to ensure they are Task objects if coming from JSON
    return rawTasks.map(t => new Task({
        ...t,
        dueDate: new Date(t.dueDate)
    }));
  }

  async deleteTask(id: string): Promise<void> {
    let tasks = await this.getAllTasks();
    tasks = tasks.filter(t => t.id !== id);
    await this.storage.write(tasks);
  }

  async searchTasks(keyword: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    const lowKeyword = keyword.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowKeyword) || 
      t.description.toLowerCase().includes(lowKeyword)
    );
  }

  async filterTasks(priority?: Priority, startDate?: Date, endDate?: Date): Promise<Task[]> {
    let tasks = await this.getAllTasks();
    
    if (priority) {
      tasks = tasks.filter(t => t.priority === priority);
    }
    
    if (startDate) {
      tasks = tasks.filter(t => t.dueDate >= startDate);
    }
    
    if (endDate) {
      tasks = tasks.filter(t => t.dueDate <= endDate);
    }
    
    return tasks;
  }

  async getSortedTasks(strategy: SortStrategy): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return strategy.sort(tasks);
  }

  async getStatistics(): Promise<{
    totalTasks: number;
    priorityBreakdown: Record<Priority, number>;
    overdueTasks: number;
  }> {
    const tasks = await this.getAllTasks();
    const now = new Date();
    
    const stats = {
      totalTasks: tasks.length,
      priorityBreakdown: {
        [Priority.LOW]: 0,
        [Priority.MEDIUM]: 0,
        [Priority.HIGH]: 0,
      },
      overdueTasks: 0,
    };

    for (const task of tasks) {
      stats.priorityBreakdown[task.priority]++;
      if (task.dueDate.getTime() < now.getTime()) {
        stats.overdueTasks++;
      }
    }

    return stats;
  }

  async exportToJson(targetPath: string): Promise<void> {
    const tasks = await this.getAllTasks();
    const { writeFile } = await import('fs/promises');
    await writeFile(targetPath, JSON.stringify(tasks, null, 2), 'utf-8');
  }

  async exportToCsv(targetPath: string): Promise<void> {
    const tasks = await this.getAllTasks();
    const headers = ['id', 'title', 'description', 'priority', 'dueDate'];
    
    const rows = tasks.map(t => {
      return [
        t.id,
        this.escapeCsv(t.title),
        this.escapeCsv(t.description),
        t.priority,
        t.dueDate.toISOString()
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const { writeFile } = await import('fs/promises');
    await writeFile(targetPath, csvContent, 'utf-8');
  }

  private escapeCsv(text: string): string {
    if (text.includes(',') || text.includes('\n') || text.includes('"')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  /**
   * INTENTIONAL CODE SMELL: Long Method / God Object
   * This method is intentionally bloated for Phase 6 refactoring.
   */
  async updateTask(id: string, updates: Partial<TaskData>): Promise<Task> {
    console.log('Initiating update process for task ID: ' + id);
    const tasks = await this.getAllTasks();
    let foundIndex = -1;
    
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex === -1) {
      throw new Error('Task not found');
    }

    const originalTask = tasks[foundIndex];
    console.log('Original task found. Commencing deep validation and cloning.');

    // Unnecessary manual cloning and object spread across layers
    const clonedUpdates = JSON.parse(JSON.stringify(updates));
    const mergedData: any = {};
    
    // Manual field-by-field check with repetitive logic
    if (clonedUpdates.title !== undefined) {
      console.log('Title update detected.');
      const sanitizedTitle = clonedUpdates.title.toString().trim();
      if (sanitizedTitle.length === 0) {
        throw new Error('Title cannot be empty');
      }
      mergedData.title = sanitizedTitle;
    } else {
      mergedData.title = originalTask.title;
    }

    if (clonedUpdates.description !== undefined) {
      mergedData.description = clonedUpdates.description.toString();
    } else {
      mergedData.description = originalTask.description;
    }

    if (clonedUpdates.priority !== undefined) {
      if (!Object.values(Priority).includes(clonedUpdates.priority)) {
        throw new Error('Invalid priority');
      }
      mergedData.priority = clonedUpdates.priority;
    } else {
      mergedData.priority = originalTask.priority;
    }

    if (clonedUpdates.dueDate !== undefined) {
      const newDate = new Date(clonedUpdates.dueDate);
      if (isNaN(newDate.getTime())) {
        throw new Error('Invalid date format');
      }
      if (newDate.getTime() < new Date().getTime() - 1000) {
        throw new Error('Due date cannot be in the past');
      }
      mergedData.dueDate = newDate;
    } else {
      mergedData.dueDate = originalTask.dueDate;
    }

    mergedData.id = originalTask.id;

    console.log('Validation complete. Creating new Task instance.');
    const updatedTask = new Task(mergedData as TaskData);
    
    tasks[foundIndex] = updatedTask;
    
    console.log('Writing back to storage.');
    // Manual array manipulation instead of cleaner methods
    const finalTasksToSave = [];
    for (const t of tasks) {
        finalTasksToSave.push(t);
    }
    
    await this.storage.write(finalTasksToSave);
    console.log('Update successful.');
    return updatedTask;
  }
}
