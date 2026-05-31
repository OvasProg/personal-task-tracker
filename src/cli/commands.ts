import * as readline from "readline";
import { TaskService } from "../services/task_service";
import { Priority, Task } from "../models/task";
import {
  SortByDateStrategy,
  SortByPriorityStrategy,
} from "../patterns/strategy";

export class CLI {
  private rl: readline.Interface;

  constructor(private taskService: TaskService) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(query: string): Promise<string> {
    return new Promise((resolve) => this.rl.question(query, resolve));
  }

  public async start(): Promise<void> {
    console.log("--- Personal Task Tracker CLI ---");
    let running = true;

    while (running) {
      console.log("\nAvailable Operations:");
      console.log("1. Add Task");
      console.log("2. List Tasks");
      console.log("3. Update Task");
      console.log("4. Delete Task");
      console.log("5. Search Tasks");
      console.log("6. Filter Tasks");
      console.log("7. Sort Tasks");
      console.log("8. Export JSON");
      console.log("9. Export CSV");
      console.log("10. View Statistics");
      console.log("0. Exit");

      const choice = await this.question("\nSelect an option: ");

      try {
        switch (choice) {
          case "1":
            await this.handleAddTask();
            break;
          case "2":
            await this.handleListTasks();
            break;
          case "3":
            await this.handleUpdateTask();
            break;
          case "4":
            await this.handleDeleteTask();
            break;
          case "5":
            await this.handleSearchTasks();
            break;
          case "6":
            await this.handleFilterTasks();
            break;
          case "7":
            await this.handleSortTasks();
            break;
          case "8":
            await this.handleExportJson();
            break;
          case "9":
            await this.handleExportCsv();
            break;
          case "10":
            await this.handleViewStatistics();
            break;
          case "0":
            running = false;
            break;
          default:
            console.log("Invalid option.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
        } else {
          console.error("An unknown error occurred.");
        }
      }
    }

    this.rl.close();
    console.log("Goodbye!");
  }

  private async handleAddTask(): Promise<void> {
    const title = await this.question("Title: ");
    const description = await this.question("Description: ");
    const priorityStr = await this.question("Priority (LOW, MEDIUM, HIGH): ");
    const dueDateStr = await this.question("Due Date (YYYY-MM-DD): ");

    const priority =
      Priority[priorityStr.toUpperCase() as keyof typeof Priority];
    const dueDate = new Date(dueDateStr);

    const task = await this.taskService.createTask({
      title,
      description,
      priority,
      dueDate,
    });
    console.log(`Task created with ID: ${task.id}`);
  }

  private async handleListTasks(): Promise<void> {
    const tasks = await this.taskService.getAllTasks();
    this.printTasks(tasks);
  }

  private async handleUpdateTask(): Promise<void> {
    const id = await this.question("Task ID to update: ");
    const title = await this.question("New Title (leave blank to skip): ");
    const description = await this.question(
      "New Description (leave blank to skip): ",
    );
    const priorityStr = await this.question(
      "New Priority (leave blank to skip): ",
    );
    const dueDateStr = await this.question(
      "New Due Date (YYYY-MM-DD, leave blank to skip): ",
    );

    const updates: Partial<{
      title: string;
      description: string;
      priority: Priority;
      dueDate: Date;
    }> = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (priorityStr)
      updates.priority =
        Priority[priorityStr.toUpperCase() as keyof typeof Priority];
    if (dueDateStr) updates.dueDate = new Date(dueDateStr);

    await this.taskService.updateTask(id, updates);
    console.log("Task updated successfully.");
  }

  private async handleDeleteTask(): Promise<void> {
    const id = await this.question("Task ID to delete: ");
    await this.taskService.deleteTask(id);
    console.log("Task deleted.");
  }

  private async handleSearchTasks(): Promise<void> {
    const keyword = await this.question("Search keyword: ");
    const tasks = await this.taskService.searchTasks(keyword);
    this.printTasks(tasks);
  }

  private async handleFilterTasks(): Promise<void> {
    const priorityStr = await this.question(
      "Priority filter (leave blank for all): ",
    );
    const priority = priorityStr
      ? Priority[priorityStr.toUpperCase() as keyof typeof Priority]
      : undefined;

    const tasks = await this.taskService.filterTasks(priority);
    this.printTasks(tasks);
  }

  private async handleSortTasks(): Promise<void> {
    console.log("1. Sort by Date");
    console.log("2. Sort by Priority");
    const choice = await this.question("Choice: ");

    const strategy =
      choice === "1" ? new SortByDateStrategy() : new SortByPriorityStrategy();
    const tasks = await this.taskService.getSortedTasks(strategy);
    this.printTasks(tasks);
  }

  private async handleExportJson(): Promise<void> {
    const path = await this.question(
      "Target JSON path (e.g., tasks.json or docs/tasks.json): ",
    );
    await this.taskService.exportToJson(path);
    console.log(`Exported to ${path}`);
  }

  private async handleExportCsv(): Promise<void> {
    const path = await this.question(
      "Target CSV path (e.g., backup.csv or docs/backup.csv): ",
    );
    await this.taskService.exportToCsv(path);
    console.log(`Exported to ${path}`);
  }

  private async handleViewStatistics(): Promise<void> {
    const stats = await this.taskService.getStatistics();
    console.log("\n--- Statistics ---");
    console.log(`Total Tasks: ${stats.totalTasks}`);
    console.log(`Overdue Tasks: ${stats.overdueTasks}`);
    console.log("Priority Breakdown:");
    console.log(`  HIGH: ${stats.priorityBreakdown[Priority.HIGH]}`);
    console.log(`  MEDIUM: ${stats.priorityBreakdown[Priority.MEDIUM]}`);
    console.log(`  LOW: ${stats.priorityBreakdown[Priority.LOW]}`);
  }

  private printTasks(tasks: Task[]): void {
    if (tasks.length === 0) {
      console.log("No tasks found.");
      return;
    }
    console.log("\nID | Title | Priority | Due Date");
    console.log("---------------------------------");
    tasks.forEach((t) => {
      console.log(
        `${t.id} | ${t.title} | ${t.priority} | ${t.dueDate.toLocaleDateString()}`,
      );
    });
  }
}
