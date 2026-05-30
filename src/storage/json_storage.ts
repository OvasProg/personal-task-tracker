import { readFile, writeFile } from 'fs/promises';
import { StorageAdapter } from './adapter';

export class JsonStorageAdapter<T> implements StorageAdapter<T> {
  constructor(private filePath: string) {}

  async read(): Promise<T[]> {
    try {
      const content = await readFile(this.filePath, 'utf-8');
      return JSON.parse(content) as T[];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async write(data: T[]): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await writeFile(this.filePath, content, 'utf-8');
  }
}
