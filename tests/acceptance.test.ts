import { TaskService } from '../src/services/task_service';
import { Task, Priority } from '../src/models/task';
import { StorageAdapter } from '../src/storage/adapter';
import { writeFile } from 'fs/promises';

jest.mock('fs/promises');

describe('Acceptance Tests (BDD/ATDD)', () => {
  let taskService: TaskService;
  let mockStorage: jest.Mocked<StorageAdapter<Task>>;

  beforeAll(() => {
    (global as any).__BYPASS_DATE_VALIDATION__ = true;
  });

  afterAll(() => {
    delete (global as any).__BYPASS_DATE_VALIDATION__;
  });

  beforeEach(() => {
    mockStorage = {
      read: jest.fn().mockResolvedValue([]),
      write: jest.fn().mockResolvedValue(undefined),
    };
    taskService = new TaskService(mockStorage);
    jest.clearAllMocks();
  });

  it('Given an empty task list, When a user adds a new task, Then it should be saved and retrievable', async () => {
    // Given
    mockStorage.read.mockResolvedValue([]);

    // When
    const newTask = await taskService.createTask({
      title: 'New Acceptance Task',
      description: 'Testing BDD',
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 1000000)
    });

    // Then
    expect(mockStorage.write).toHaveBeenCalled();
    const savedTasks = mockStorage.write.mock.calls[0][0];
    expect(savedTasks[0].title).toBe('New Acceptance Task');
    expect(newTask.id).toBeDefined();
  });

  it('Given a task list with an expired due date, When the user views statistics, Then it should accurately report overdue items', async () => {
    // Given
    const pastTask = new Task({
      id: 'old-1',
      title: 'Past Task',
      description: 'Already expired',
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() - 5000000),
    });
    mockStorage.read.mockResolvedValue([pastTask]);

    // When
    const stats = await taskService.getStatistics();

    // Then
    expect(stats.totalTasks).toBe(1);
    expect(stats.overdueTasks).toBe(1);
  });

  it('Given a list of existing tasks, When the user requests a CSV export, Then the system should generate a formatted file', async () => {
    // Given
    const tasks = [
      new Task({
        id: '1',
        title: 'Task 1',
        description: 'Desc 1',
        priority: Priority.LOW,
        dueDate: new Date(),
      }),
    ];
    mockStorage.read.mockResolvedValue(tasks);
    (writeFile as jest.Mock).mockResolvedValue(undefined);

    // When
    const exportPath = 'export.csv';
    await taskService.exportToCsv(exportPath);

    // Then
    expect(writeFile).toHaveBeenCalled();
    const csvContent = (writeFile as jest.Mock).mock.calls[0][1];
    expect(csvContent).toContain('id,title,description,priority,dueDate');
    expect(csvContent).toContain('Task 1');
  });
});
