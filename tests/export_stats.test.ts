import { TaskService } from '../src/services/task_service';
import { Task, Priority } from '../src/models/task';
import { StorageAdapter } from '../src/storage/adapter';
import { writeFile } from 'fs/promises';

jest.mock('fs/promises');

describe('TaskService - Black-Box Export & Statistics', () => {
  let taskService: TaskService;
  let mockStorage: jest.Mocked<StorageAdapter<Task>>;

  const now = new Date();
  const pastDate = new Date(now.getTime() - 1000000);
  const futureDate = new Date(now.getTime() + 1000000);

  // Set the bypass flag BEFORE creating the mock tasks at the module level
  (global as any).__BYPASS_DATE_VALIDATION__ = true;

  const mockTasks = [
    new Task({
      id: '1',
      title: 'Past Task',
      description: 'Overdue task',
      priority: Priority.HIGH,
      dueDate: pastDate,
    }),
    new Task({
      id: '2',
      title: 'Future Task, with comma',
      description: 'Not overdue\nwith newline',
      priority: Priority.LOW,
      dueDate: futureDate,
    }),
  ];

  afterAll(() => {
    delete (global as any).__BYPASS_DATE_VALIDATION__;
  });

  beforeEach(() => {
    mockStorage = {
      read: jest.fn().mockResolvedValue([...mockTasks]),
      write: jest.fn().mockResolvedValue(undefined),
    };
    taskService = new TaskService(mockStorage);
    jest.clearAllMocks();
  });

  describe('getStatistics()', () => {
    it('should correctly calculate totals, priority breakdown, and overdue counts', async () => {
      const stats = await taskService.getStatistics();
      
      expect(stats.totalTasks).toBe(2);
      expect(stats.priorityBreakdown[Priority.HIGH]).toBe(1);
      expect(stats.priorityBreakdown[Priority.LOW]).toBe(1);
      expect(stats.priorityBreakdown[Priority.MEDIUM]).toBe(0);
      expect(stats.overdueTasks).toBe(1); // Only 'Past Task'
    });
  });

  describe('exportToCsv()', () => {
    it('should output a correctly formatted CSV string with headers and escaped values', async () => {
      const targetPath = 'export.csv';
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await taskService.exportToCsv(targetPath);

      expect(writeFile).toHaveBeenCalled();
      const callArgs = (writeFile as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe(targetPath);
      
      const csvContent = callArgs[1];
      const lines = csvContent.split('\n');
      
      // Header check
      expect(lines[0]).toBe('id,title,description,priority,dueDate');
      
      // Row 1 (Past Task)
      expect(lines[1]).toContain('1,Past Task,Overdue task,HIGH');
      
      // Row 2 (Future Task with comma and newline)
      expect(csvContent).toContain('"Future Task, with comma"');
      expect(csvContent).toContain('"Not overdue\nwith newline"');
    });
  });

  describe('exportToJson()', () => {
    it('should output a valid JSON stringified array', async () => {
      const targetPath = 'export.json';
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await taskService.exportToJson(targetPath);

      expect(writeFile).toHaveBeenCalled();
      const jsonContent = (writeFile as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(jsonContent);
      
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
      expect(parsed[0].id).toBe('1');
    });
  });
});
