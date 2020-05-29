import { Note, Position, LongNote } from "~NoteView/types";
import { store, dispatch } from "~StateStore/store";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { getBarIndex } from "~utils/bar"

export function getNoteOnPosition(position: Position): Note | undefined {
  const { bars } = store.getState().barState;
  const bar = bars.find(bar => bar.id === position.barId);
  return bar?.notes.find(note => note.position.equals(position));
}

export function getLongNoteBySingleNote(note: Note): LongNote | undefined {
  return store.getState().longNoteState.longNotes.find(longNote =>
    note.id === longNote.startNote.id
    || note.id === longNote.endNote.id);
}

export function removeLongNote(longNote: LongNote) {
  dispatch(LongNoteAction.removeLongNote(longNote));
}

export function removeSingleNote(note: Note, barIndex?: number) {
  dispatch(BarAction.removeNote(barIndex || getBarIndex(note.position.barId), note));
}

export function removeNote(note: Note, barIndex?: number) {
  const longNote = getLongNoteBySingleNote(note);
  if (longNote) {
    removeLongNote(longNote);
  }
  removeSingleNote(note, barIndex);
}

export function removeOverFlowedNotes(beat: number, barId: string, barIndex: number) {
  dispatch(LongNoteAction.removeOverflowedLongNotes(barId, beat));
  dispatch(BarAction.removeOverflowedNotes(barIndex, beat));
}
