import { Position, LongNote, Note } from "./types";
import { store, dispatch } from "~StateStore/store";
import { getNoteOnPosition } from "~utils/note";
import { SelectNoteAction } from "~StateStore/_gen/selectNote_action.ts";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";
import uuid from "~utils/uuid";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { getBarIndex } from "~utils/bar";
import { batchActions } from "redux-batched-actions";
import { List } from "immutable";

function setStartNote(position: Position, noteOnPosition?: Note) {
  if (noteOnPosition) {
    const newLongNote = new LongNote({
      id: uuid(),
      startNote: noteOnPosition,
    })

    dispatch(batchActions([
      LongNoteAction.updateEditingLongNote(newLongNote),
      SelectNoteAction.selectNote(noteOnPosition.id),
    ]))
    return;
  }

  const newNote = new Note({
    position,
    id: uuid(),
    type: store.getState().modeState.noteTypeMode
  });

  const newLongNote = new LongNote({
    id: uuid(),
    startNote: newNote,
  })

  dispatch(batchActions([
    BarAction.addNote(getBarIndex(position.barId), newNote),
    LongNoteAction.updateEditingLongNote(newLongNote),
    SelectNoteAction.selectNote(newNote.id),
  ]));
}

export function cancleEditingLongNote() {
  dispatch(LongNoteAction.finishEditingLongNote());
}

export function handleLeftClick(position: Position) {
  const editingLongNote = store.getState().longNoteState.editingLongNote;
  const noteOnPosition = getNoteOnPosition(position);

  if (!editingLongNote) {
    setStartNote(position, noteOnPosition);
    return;
  }

  if (noteOnPosition) {
    dispatch(batchActions([
      LongNoteAction.addLongNote((editingLongNote as LongNote).set('endNote', noteOnPosition)),
      SelectNoteAction.selectNote(noteOnPosition.id),
      LongNoteAction.finishEditingLongNote(),
    ]))
  }

  const middlePoints: List<Position> = editingLongNote.middlePoints || List();
  const lastMiddlePoint = middlePoints.last(0) || undefined;
  console.log(middlePoints.last(0), position);
  const isLastMiddlePointClicked = lastMiddlePoint?.barId === position.barId
    && lastMiddlePoint?.beat === position.beat
    && lastMiddlePoint?.key === position.key;

  if (isLastMiddlePointClicked) {
    middlePoints.pop();
    const newNote = new Note({
      position,
      id: uuid(),
      type: store.getState().modeState.noteTypeMode
    });

    dispatch(batchActions([
      BarAction.addNote(getBarIndex(newNote.position.barId), newNote),
      LongNoteAction.addLongNote((editingLongNote as LongNote)
        .set('middlePoints', middlePoints.pop())
        .set('endNote', newNote)),
      SelectNoteAction.selectNote(newNote.id),
      LongNoteAction.finishEditingLongNote(),
    ]))
    return;
  }

  dispatch(LongNoteAction.updateEditingLongNote((editingLongNote as LongNote).set('middlePoints', middlePoints.push(position))));
}
