import StorageServiceBase from "./storageServiceBase";
import { StorageItem, StorageServiceSaveOption, StorageDirectoryEntry, StorageDirectory } from "./types";
import { JSONreviver } from "~NoteView/runTestCode";

export default class BrowserStorageService extends StorageServiceBase {
  constructor() {
    super();
    this.loadIndex();
  }

  public readonly defaultPath = '';

  public parsePath(path: string) {
    return [path];
  }

  public stringifyPath(path: string[]) {
    return path.join('');
  }

  private storageIndex: StorageDirectory = [];

  private async loadIndex() {
    const storageIndex = JSON.parse(localStorage.getItem('storageIndex') || '[]') as StorageDirectory;
    this.storageIndex = storageIndex;
  }

  public async getDirectory() {
    return this.storageIndex;
  }

  public async load(path: string) {
    const storageString = localStorage.getItem(`storageItem-${path}`);
    if (!storageString) {
      return null;
    }
    const storageItem = JSON.parse(storageString, JSONreviver) as StorageItem;
    return storageItem;
  }

  public async save(option: StorageServiceSaveOption) {
    const path = option.path;
    const name = this.parsePath(path).pop() || new Date().toISOString();

    const storageDirectoryEntry: StorageDirectoryEntry = {
      isDirectory: false,
      name,
    };

    this.storageIndex = this.storageIndex.filter(storageInfo => storageInfo.name !== name);
    this.storageIndex.push(storageDirectoryEntry);

    localStorage.setItem('storageIndex', JSON.stringify(this.storageIndex));
    localStorage.setItem(`storageItem-${path}`, JSON.stringify(option.rootState));

    return true;
  }

  public async delete(path: string) {
    const storageIndex = this.storageIndex.filter(storageInfo => storageInfo.name !== path);
    this.storageIndex = storageIndex;

    localStorage.setItem('storageIndex', JSON.stringify(storageIndex));
    localStorage.removeItem(`storageItem-${path}`);

    return true;
  }
}
