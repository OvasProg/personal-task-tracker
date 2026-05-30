import { readFile, writeFile } from 'fs/promises';
import { JsonStorageAdapter } from '../src/storage/json_storage';

jest.mock('fs/promises');

describe('JsonStorageAdapter', () => {
  const filePath = 'test.json';
  const adapter = new JsonStorageAdapter<{ id: string }>(filePath);
  const mockData = [{ id: '1' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('write', () => {
    it('should successfully write data to a file', async () => {
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await adapter.write(mockData);

      expect(writeFile).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(mockData, null, 2),
        'utf-8'
      );
    });
  });

  describe('read', () => {
    it('should successfully read existing data', async () => {
      (readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const result = await adapter.read();

      expect(result).toEqual(mockData);
      expect(readFile).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should return an empty array if the file does not exist (ENOENT)', async () => {
      const error = new Error('File not found');
      (error as any).code = 'ENOENT';
      (readFile as jest.Mock).mockRejectedValue(error);

      const result = await adapter.read();

      expect(result).toEqual([]);
      expect(readFile).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should throw an error for non-ENOENT read failures', async () => {
      const error = new Error('Permission denied');
      (error as any).code = 'EACCES';
      (readFile as jest.Mock).mockRejectedValue(error);

      await expect(adapter.read()).rejects.toThrow('Permission denied');
    });
  });
});
