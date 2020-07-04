import { StorageServiceSaveOption, StorageItem, StorageDirectory } from "./types";

export default abstract class StorageServiceBase {
  abstract defaultPath: string;

  abstract parsePath(path: string): string[];

  abstract stringifyPath(path: string[]): string;

  abstract async getDirectory(path?: string): Promise<StorageDirectory | null>;

  abstract async save(option: StorageServiceSaveOption): Promise<boolean>;

  abstract async load(path: string): Promise<StorageItem | null>;

  abstract async delete(path: string): Promise<boolean>;
}
