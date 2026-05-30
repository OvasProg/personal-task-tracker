# Refactoring Report: TaskService updateTask

This report documents the refactoring of the `updateTask` method in `src/services/task_service.ts`, transitioning from an intentional "Long Method" code smell to a clean, maintainable implementation.

## 1. Identified Code Smells

- **Long Method:** The initial implementation was over 80 lines long, handling everything from input parsing and validation to manual array manipulation and logging.
- **God Object / Lack of SRP:** The method took on too many responsibilities, including deep validation logic that should ideally reside within the domain model.
- **Primitive Obsession:** Heavy use of manual string transformations and repetitive checks on primitive values instead of leveraging TypeScript's type system or domain objects.
- **Redundant Logic:** Manual loops for finding indices and cloning arrays instead of using built-in array methods like `findIndex`.

## 2. Before & After Comparison

### Before (Snippet)
```typescript
async updateTask(id: string, updates: Partial<TaskData>): Promise<Task> {
    console.log('Initiating update process for task ID: ' + id);
    const tasks = await this.getAllTasks();
    let foundIndex = -1;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) { foundIndex = i; break; }
    }
    // ... repetitive manual field-by-field validation and cloning ...
    const updatedTask = new Task(mergedData as TaskData);
    // ... manual array reconstruction ...
}
```

### After (Snippet)
```typescript
async updateTask(id: string, updates: Partial<TaskData>): Promise<Task> {
    const tasks = await this.getAllTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) throw new Error('Task not found');

    const updatedTask = new Task({
      ...tasks[taskIndex],
      ...this.normalizeUpdates(updates),
      id: tasks[taskIndex].id
    });
    // ... simple storage update ...
}
```

## 3. Quantitative Metrics

| Metric | Before Refactor | After Refactor | Improvement |
| :--- | :--- | :--- | :--- |
| **Lines of Code (LOC)** | ~85 | ~20 | **~76% Reduction** |
| **Cyclomatic Complexity** | 14 | 3 | **~78% Reduction** |

*Note: LOC excludes comments. Complexity measured by the number of decision points (if/for/catch).*

## 4. Final Reflection

The refactoring of `updateTask` demonstrates the immense value of the **Single Responsibility Principle (SRP)**. By delegating validation logic to the `Task` entity's constructor and leveraging modern JavaScript features like the spread operator and `findIndex`, we transformed a brittle, hard-to-read "God Method" into a concise and robust operation. This not only reduces the surface area for bugs but also makes the codebase significantly easier for other engineers to reason about and extend.
