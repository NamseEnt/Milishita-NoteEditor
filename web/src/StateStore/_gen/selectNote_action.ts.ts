import { SelectNoteState } from './selectNote_state'
import { Note, NoteType } from '~NoteView/types';

///BEGIN

export const SELECT_NOTE = "SELECT_NOTE" as const;
export const DESELECT_NOTE = "DESELECT_NOTE" as const;

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

}


export type SelectNoteAction = {
  type: typeof SELECT_NOTE;
  noteId: string;
};


export type DeselectNoteAction = {
  type: typeof DESELECT_NOTE;
};


export type SelectNoteActions = SelectNoteAction | DeselectNoteAction

export interface ISelectNoteReducers {
  SELECT_NOTE(state: SelectNoteState, action: SelectNoteAction): SelectNoteState;
  DESELECT_NOTE(state: SelectNoteState, action: DeselectNoteAction): SelectNoteState;
};