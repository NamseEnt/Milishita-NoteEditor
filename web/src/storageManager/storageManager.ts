import StorageServiceBase from "./storageServiceBase";
import BrowserStorageService from "./browserStorageService";
import { StorageItem, StorageItemInfo, StorageDirectory } from "./types";
import { store } from "~StateStore/store";
import { EventEmitter } from "events";
import { applyStorageItemToCurrentState, getStorageItemFromCurrentState } from "./util";

interface StorageManager {
  on(event: 'storageServiceChanged', listener: (previousStorageServiceName: string, nextStorageServiceName: string) => void): this;

  emit(event: 'storageServiceChanged', previousStorageServiceName: string, nextStorageServiceName: string): boolean;

  off(event: 'storageServiceChanged', listener: (previousStorageServiceName: string, nextStorageServiceName: string) => void): this;
}

class StorageManager extends EventEmitter{
  constructor() {
    super();
    const browserStorageService = new BrowserStorageService();
    this.addStorageservice('Browser Local Storage', browserStorageService);
    this.storageServiceName = 'Browser Local Storage';
    this.storageService = browserStorageService;
  }
  private storageServiceMap: Map<string, StorageServiceBase> = new Map();

  private storageServiceName: string;

  private storageService: StorageServiceBase;
  
  private itemInfo?: StorageItemInfo;

  public getStorageServiceName() {
    return this.storageServiceName;
  }

  public getStorageServiceList() {
    return [ ...this.storageServiceMap.keys()];
  }

  public addStorageservice(name: string, storageService: StorageServiceBase) {
    this.storageServiceMap.set(name, storageService);
  }

  public setStorageService(storageServiceName: string) {
    const storageService = this.storageServiceMap.get(storageServiceName);
    if (!storageService) {
      return false;
    }
    this.storageService = storageService;
    const previousStorageServiceName = this.storageServiceName;
    this.storageServiceName = storageServiceName;

    this.emit('storageServiceChanged', previousStorageServiceName, storageServiceName);
    return true;
  }

  public getItemInfo() {
    return this.itemInfo;
  }

  public get defaultPath() {
    return this.storageService.defaultPath;
  }

  public parsePath(path: string): string[] {
    return this.storageService.parsePath(path);
  }

  public stringifyPath(path: string[]): string {
    return this.storageService.stringifyPath(path);
  }

  public async save(newPath?: string): Promise<boolean> {
    const name = (newPath ? this.parsePath(newPath).pop() : null) || this.itemInfo?.name || new Date().toISOString();
    const path = newPath || this.itemInfo?.path || this.storageService.stringifyPath([...this.storageService.parsePath(this.storageService.defaultPath), name]);

    return this.storageService.save({
      path,
      storageItem: getStorageItemFromCurrentState(),
    }).then(success => {
      if (success) {
        this.itemInfo = {
          name,
          path,
        };
      }
      return success;
    })
  }

  public async load(path: string): Promise<StorageItem | null> {
    const storageItem = await this.storageService.load(path);

    if (!storageItem) {
      return null;
    }

    this.itemInfo = {
      name: this.storageService.parsePath(path).pop() as string,
      path,
    };

    applyStorageItemToCurrentState(storageItem);

    return storageItem;
  }

  public async getDirectory(path?: string): Promise<StorageDirectory | null> {
    return this.storageService.getDirectory(path);
  }

  public async delete(path: string): Promise<boolean> {
    const deleted = await this.storageService.delete(path);
    if (deleted) {
      this.itemInfo = undefined;
    }
    return deleted;
  }
}

const storageManager = new StorageManager();

export default storageManager;
