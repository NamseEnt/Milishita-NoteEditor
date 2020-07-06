import { Bar, LongNote } from "~NoteView/types";
import { List, Record } from "immutable";

export type StorageDirectoryEntry = {
  isDirectory: boolean;
  name: string;
};

export type StorageDirectory = StorageDirectoryEntry[];

export type StorageServiceSaveOption = {
  path: string;
  storageItem: StorageItem;
};

export type StorageItemInfo = {
  name: string;
  path: string;
};

export type StorageItem = Record<{
  beats: number;
  bars: List<Bar>;
  longNotes: List<LongNote>;
  keys: number;
  bpm: number;
}>;
