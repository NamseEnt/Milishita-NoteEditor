import { dispatch } from "~StateStore/store";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { LongNote, Bar } from "./types";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";
import bars from './bars.json';
import longNotes from './longNotes.json';
import { isKeyed, Record, List } from "immutable";
import player from "~Config/Player";

const dearUrl = require('../dear.mp3');
console.log(dearUrl);
player.setAudioSource(dearUrl);

export function JSONreviver(key: any, value: any) {
  if (Array.isArray(value)) {
    return List(value);
  }
  if (value !== undefined && value !== null && value.constructor === Object) {
    return new (Record(value));
  }
  return value;
}

function reviver(key: any, value: any) {
  console.log(isKeyed(value));
  return isKeyed(value) ? Record(value.toObject()) : value;
}

export function runTestCode() {
  bars
    .map((bar: any) => {
      const json = JSON.stringify(bar)
      return JSON.parse(json, JSONreviver);
    })
    .forEach((bar: Bar) => {
      console.log(bar);
      console.log(new Bar(bar));
      dispatch(BarAction.addBar(new Bar(bar)));
    });

  longNotes
    .map((longNote: any) => {
      const json = JSON.stringify(longNote)
      return JSON.parse(json, JSONreviver);
    })
    .forEach((longNote: LongNote) => {
      dispatch(LongNoteAction.addLongNote(new LongNote(longNote)));
    });
}
