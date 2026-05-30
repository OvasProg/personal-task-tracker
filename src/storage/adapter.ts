export interface StorageAdapter<T> {
  read(): Promise<T[]>;
  write(data: T[]): Promise<void>;
}
