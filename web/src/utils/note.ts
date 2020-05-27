import { Note, Position } from "~NoteView/types";
import { store } from "~StateStore/store";

export function getNoteOnPosition(position: Position): Note | undefined {
  const { bars } = store.getState().barState;
  const bar = bars.find(bar => bar.id === position.barId);
  return bar?.notes.find(note => note.position.equals(position));
}
