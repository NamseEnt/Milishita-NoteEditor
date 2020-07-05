import { dispatch } from "~StateStore/store";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { LongNote, Bar } from "./types";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";
import bars from './bars.json';
import longNotes from './longNotes.json';
import { isKeyed, Record } from "immutable";
import player from "~Config/Player";
import { JSONreviver } from "~storageManager/util";

const dearUrl = require('../dear.mp3');
console.log(dearUrl);
player.setAudioSource(dearUrl);

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
