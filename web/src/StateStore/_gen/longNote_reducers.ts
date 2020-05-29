import { ILongNoteReducers, LongNoteActions, AddLongNoteAction, UpdateLongNoteAction, UpdateEditingLongNoteAction, FinishEditingLongNoteAction, RemoveLongNoteAction, RemoveLongNotesOnBarAction } from "./longNote_action.ts";
import { LongNoteState } from "./longNote_state";

export class LongNoteReducers implements ILongNoteReducers {
  FINISH_EDITING_LONG_NOTE(state: LongNoteState, action: FinishEditingLongNoteAction): LongNoteState {
    return state.update('editingLongNote', _ => undefined);
  }
  UPDATE_EDITING_LONG_NOTE(state: LongNoteState, action: UpdateEditingLongNoteAction): LongNoteState {
    return state.update('editingLongNote', _ => action.longNote);
  }
  ADD_LONG_NOTE(state: LongNoteState, action: AddLongNoteAction): LongNoteState {
    return state.update('longNotes', longNotes => longNotes.push(action.longNote));
  }
  UPDATE_LONG_NOTE(state: LongNoteState, action: UpdateLongNoteAction): LongNoteState {
    throw new Error("Method not implemented.");
  }
  REMOVE_LONG_NOTE(state: LongNoteState, action: RemoveLongNoteAction): LongNoteState {
    return state.update('longNotes', longNotes => longNotes.filter(longNote => longNote.id != action.longNote.id));
  }
  REMOVE_LONG_NOTES_ON_BAR(state: LongNoteState, action: RemoveLongNotesOnBarAction): LongNoteState {
    return state.update('longNotes', longNotes => longNotes.filter(longNote => longNote.startNote.position.barId !== action.barId
      && longNote.endNote.position.barId !== action.barId
      && longNote.middlePoints.every(middlePoint => middlePoint.barId !== action.barId)
    ));
  }
};

const reducers = new LongNoteReducers();

export function longNoteReducer(
  state: LongNoteState = new LongNoteState(),
  action: LongNoteActions,
): LongNoteState {
  const handler = (reducers as any)[action.type] as any;
  if (!handler) {
    return state;
  }
  return handler.bind(reducers)(state, action);
}
