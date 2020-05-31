import { SelectNoteState } from './selectNote_state'
import { Note, NoteType } from '~NoteView/types';

///BEGIN

export const SELECT_NOTE = "SELECT_NOTE" as const;
export const DESELECT_NOTE = "DESELECT_NOTE" as const;
export const SET_SELECT_NOTE_STATE = "SET_SELECT_NOTE_STATE" as const;

 export namespace SelectNoteAction {
  export function selectNote(noteId: string) {
    return {
      type: SELECT_NOTE,
      noteId,
    };
  }


  export function deselectNote() {
    return {
      type: DESELECT_NOTE,
    };
  }


  export function setSelectNoteState(state: SelectNoteState) {
    return {
      type: SET_SELECT_NOTE_STATE,
      state,
    };
  }

}


export type SelectNoteAction = {
  type: typeof SELECT_NOTE;
  noteId: string;
};


export type DeselectNoteAction = {
  type: typeof DESELECT_NOTE;
};


export type SetSelectNoteStateAction = {
  type: typeof SET_SELECT_NOTE_STATE;
  state: SelectNoteState;
};


export type SelectNoteActions = SelectNoteAction | DeselectNoteAction | SetSelectNoteStateAction

export interface ISelectNoteReducers {
  SELECT_NOTE(state: SelectNoteState, action: SelectNoteAction): SelectNoteState;
  DESELECT_NOTE(state: SelectNoteState, action: DeselectNoteAction): SelectNoteState;
  SET_SELECT_NOTE_STATE(state: SelectNoteState, action: SetSelectNoteStateAction): SelectNoteState;
};