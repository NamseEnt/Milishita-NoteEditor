import { LongNote, Position, Note } from "~NoteView/types";
import uuid from "~utils/uuid";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";
import { getNoteOnPosition } from "~utils/note";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { dispatch, store } from "~StateStore/store";
import { getBarIndex } from "~utils/bar";
import { batchActions } from "redux-batched-actions";

async function waitClick(token: CancellationToken): Promise<Position> {
  return new Promise((resolve, reject) => {
    dispatch(BarAction.waitBarClick((position) => {
      if (token.isCancelled) {
        reject('token canceled');
        return;
      }
      resolve(position);
    }));
  });
}

export class CancellationToken {
  public static None: CancellationToken = new CancellationToken();
  private _isCancelled: boolean = false;
  get isCancelled(): boolean {
    return this._isCancelled;
  }
  throwIfCancelled(): void {
    if (this.isCancelled) {
      throw new Error('canceled');
    }
  }
  cancel(): void {
    this._isCancelled = true;
  }
}

async function getStartNote(token: CancellationToken): Promise<Note> {
  const position = await waitClick(token);
  const noteOnPosition = getNoteOnPosition(position);

  if (noteOnPosition) {
    return noteOnPosition;
  }

  const newNote = new Note({ position, id: uuid(), type: store.getState().modeState.noteTypeMode });
  dispatch(BarAction.addNote(getBarIndex(newNote.position.barId), newNote));
  return newNote;
}

async function getEndNoteAndMiddlePoints(
  onMiddlePointUpdate: ((middlePoints: Position[]) => void),
  token: CancellationToken,
): Promise<{ endNote: Note, middlePoints: Position[] }> {
  const middlePoints: Position[] = [];

  while (true) {
    token.throwIfCancelled();
    const position = await waitClick(token);
    const noteOnPosition = getNoteOnPosition(position);

    if (noteOnPosition) {
      return {
        endNote: noteOnPosition,
        middlePoints,
      }
    }

    if (middlePoints[middlePoints.length - 1]?.equals(position)) {
      middlePoints.pop();
      const endNote = new Note({ position, id: uuid(), type: store.getState().modeState.noteTypeMode });
      dispatch(BarAction.addNote(getBarIndex(endNote.position.barId), endNote));
      return {
        middlePoints,
        endNote,
      };
    }

    middlePoints.push(position);
    onMiddlePointUpdate(middlePoints);
  }
}

export async function runAddLongNoteProcess(token: CancellationToken) {
  const longNoteId = uuid();
  console.log('runAddLongNoteProcess : start');

  const startNote = await getStartNote(token);
  dispatch(LongNoteAction.updateEditingLongNote(new LongNote({
    id: longNoteId,
    startNote,
  })))
  console.log('runAddLongNoteProcess startNote', startNote);

  const { endNote, middlePoints } = await getEndNoteAndMiddlePoints((middlePoints) => {
    dispatch(LongNoteAction.updateEditingLongNote(new LongNote({
      id: longNoteId,
      startNote,
      middlePoints,
    })))
  }, token);
  console.log('runAddLongNoteProcess endNote, middlePoints', endNote, middlePoints);

  const longNote = new LongNote({
    id: uuid(),
    startNote,
    endNote,
    middlePoints,
  });

  dispatch(batchActions([
    LongNoteAction.finishEditingLongNote(),
    LongNoteAction.addLongNote(longNote)
  ]));
}