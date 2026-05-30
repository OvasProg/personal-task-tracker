import { JsonStorageAdapter } from './storage/json_storage';
import { TaskService } from './services/task_service';
import { CLI } from './cli/commands';
import { Task } from './models/task';

async function main() {
  const storage = new JsonStorageAdapter<Task>('data.json');
  const taskService = new TaskService(storage);
  const cli = new CLI(taskService);

  await cli.start();
}

main().catch(console.error);
