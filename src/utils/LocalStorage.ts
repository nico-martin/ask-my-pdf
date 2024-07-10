class LocalStorage<T = Record<string, any>> {
  private static usedKeys: Set<string> = new Set();
  private storage: Storage;
  private readonly key: string;

  constructor(key: string) {
    this.storage = window.localStorage;
    if (LocalStorage.usedKeys.has(key)) {
      throw new Error(`The key "${key}" has already been used.`);
    }

    this.key = key;
    LocalStorage.usedKeys.add(key);
  }

  public set(value: T): void {
    this.storage.setItem(this.key, JSON.stringify(value));
  }

  public get(): T | null {
    const item = this.storage.getItem(this.key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  public clear(): void {
    this.storage.removeItem(this.key);
  }
}

export default LocalStorage;
