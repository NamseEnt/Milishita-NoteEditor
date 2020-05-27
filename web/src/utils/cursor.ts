import { Cursor, Position, StartInfo } from "~NoteView/types";
import { store } from "~StateStore/store";

export function toPosition(cursor: Cursor): Omit<Position, 'key'> | undefined{
  const { barState } = store.getState();
  let remainsBeats = cursor.beats;
  for (const bar of barState.bars) {
    if (bar.beat >= remainsBeats) {
      return new Position({
        barId: bar.id,
        beat: remainsBeats,
      });
    }

    remainsBeats -= bar.beat;
  }

  return undefined;
}

export function getCursor(startInfo: StartInfo): Cursor {
  const { configState } = store.getState();
  const deltaMinutes = (new Date().getTime() - startInfo.startTime.getTime()) / 1000 / 60;

  const beats = startInfo.startCursor.beats + deltaMinutes * configState.bpm;

  return new Cursor({
    beats
  });
}