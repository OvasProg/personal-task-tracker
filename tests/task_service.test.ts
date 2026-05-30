import { TaskService } from '../src/services/task_service';
import { Task, Priority } from '../src/models/task';
import { StorageAdapter } from '../src/storage/adapter';
import { SortByDateStrategy, SortByPriorityStrategy } from '../src/patterns/strategy';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockStorage: jest.Mocked<StorageAdapter<Task>>;

  const mockTasks = [
    new Task({
      id: '1',
      title: 'A Task',
      description: 'First task',
      priority: Priority.LOW,
      dueDate: new Date(Date.now() + 2000000),
    }),
    new Task({
      id: '2',
      title: 'B Task',
      description: 'Second task',
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 1000000),
    }),
  ];

  beforeEach(() => {
    mockStorage = {
      read: jest.fn().mockResolvedValue([...mockTasks]),
      write: jest.fn().mockResolvedValue(undefined),
    };
    taskService = new TaskService(mockStorage);
  });

  describe('CRUD Operations', () => {
    it('should create a task and save it', async () => {
      const title = 'New Task';
      const result = await taskService.createTask(title, 'Desc', Priority.MEDIUM, new Date(Date.now() + 100000));
      
      expect(result.title).toBe(title);
      expect(mockStorage.write).toHaveBeenCalled();
      const savedTasks = mockStorage.write.mock.calls[0][0];
      expect(savedTasks.length).toBe(mockTasks.length + 1);
    });

    it('should delete a task', async () => {
      await taskService.deleteTask('1');
      expect(mockStorage.write).toHaveBeenCalledWith([mockTasks[1]]);
    });

    it('should update a task (Testing the "Long Method")', async () => {
      const updated = await taskService.updateTask('1', { title: 'Updated Title' });
      expect(updated.title).toBe('Updated Title');
      expect(updated.id).toBe('1');
      expect(mockStorage.write).toHaveBeenCalled();
    });

    it('should throw error if update target is not found', async () => {
        await expect(taskService.updateTask('999', { title: 'No' })).rejects.toThrow('Task not found');
    });
    
    it('should throw error on invalid title update', async () => {
        await expect(taskService.updateTask('1', { title: '' })).rejects.toThrow('Title cannot be empty');
    });
  });

  describe('Search and Filter', () => {
    it('should search tasks by keyword', async () => {
      const results = await taskService.searchTasks('A Task');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('1');
    });

    it('should filter tasks by priority and date range', async () => {
      const startDate = new Date(Date.now() + 500000);
      const endDate = new Date(Date.now() + 1500000);
      const results = await taskService.filterTasks(Priority.HIGH, startDate, endDate);
      
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('2');
    });
  });

  describe('Sorting Strategies (Strategy Pattern)', () => {
    it('should sort tasks by date using SortByDateStrategy', async () => {
      const strategy = new SortByDateStrategy();
      const results = await taskService.getSortedTasks(strategy);
      
      expect(results[0].id).toBe('2'); // Earlier date
      expect(results[1].id).toBe('1');
    });

    it('should sort tasks by priority using SortByPriorityStrategy', async () => {
      const strategy = new SortByPriorityStrategy();
      const results = await taskService.getSortedTasks(strategy);
      
      expect(results[0].priority).toBe(Priority.HIGH);
      expect(results[1].priority).toBe(Priority.LOW);
    });
  });

  describe('White-Box Path Tests', () => {
    it('should branch through all updateTask field updates', async () => {
        // This test ensures we hit the branches for description, priority and dueDate in the "Long Method"
        const updates = {
            description: 'New Desc',
            priority: Priority.MEDIUM,
            dueDate: new Date(Date.now() + 5000000)
        };
        const updated = await taskService.updateTask('2', updates);
        expect(updated.description).toBe(updates.description);
        expect(updated.priority).toBe(updates.priority);
        expect(updated.dueDate.getTime()).toBe(updates.dueDate.getTime());
    });
    
    it('should throw error for invalid date in updateTask', async () => {
        await expect(taskService.updateTask('1', { dueDate: 'invalid-date' as any })).rejects.toThrow('Invalid date format');
    });

    it('should throw error for past date in updateTask', async () => {
        const pastDate = new Date(Date.now() - 5000000);
        await expect(taskService.updateTask('1', { dueDate: pastDate })).rejects.toThrow('Due date cannot be in the past');
    });

    it('should throw error for invalid priority in updateTask', async () => {
        await expect(taskService.updateTask('1', { priority: 'ULTRA' as any })).rejects.toThrow('Invalid priority');
    });
  });
});
