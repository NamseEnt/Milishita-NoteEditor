import { List, Record } from "immutable";
import { store, dispatch } from "~StateStore/store";
import { StorageItem } from "./types";
import { batchActions } from "redux-batched-actions";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { ConfigAction } from "~StateStore/_gen/config_action.ts";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";

export function JSONreviver(key: any, value: any) {
  if (Array.isArray(value)) {
    return List(value);
  }
  if (value !== undefined && value !== null && value.constructor === Object) {
    return new (Record(value));
  }
  return value;
}

export function getStorageItemFromCurrentState(): StorageItem {
  const {
    barState,
    longNoteState,
    configState,
  } = store.getState();

  const {
    beats,
    bars,
  } = barState;

  const {
    longNotes,
  } = longNoteState;

  const {
    keys,
    bpm,
  } = configState;

  return Record({
    beats,
    bars,
    longNotes,
    keys,
    bpm,
  })()
}

export function applyStorageItemToCurrentState(storageItem: StorageItem) {
  const bars = storageItem.get('bars');
  const beats = storageItem.get('beats');
  const bpm = storageItem.get('bpm');
  const keys = storageItem.get('keys');
  const longNotes = storageItem.get('longNotes');

  dispatch(batchActions([
    BarAction.applyStorageItemToBarState(beats, bars),
    ConfigAction.applyStorageItemToConfigState(keys, bpm),
    LongNoteAction.applyStorageItemToLongNoteState(longNotes),
  ]));
}
