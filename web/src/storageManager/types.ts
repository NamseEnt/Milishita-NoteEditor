import { RootState } from "~StateStore/store"

export type StorageDirectoryEntry = {
  isDirectory: boolean;
  name: string;
};

export type StorageDirectory = StorageDirectoryEntry[];

export type StorageServiceSaveOption = {
  path: string;
  rootState: RootState;
};

export type StorageItemInfo = {
  name: string;
  path: string;
};

export type StorageItem = RootState;
