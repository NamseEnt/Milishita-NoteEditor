import { LongNoteState } from './longNote_state'
import { LongNote } from '~NoteView/types';

///BEGIN

export const ADD_LONG_NOTE = "ADD_LONG_NOTE" as const;
export const UPDATE_LONG_NOTE = "UPDATE_LONG_NOTE" as const;
export const UPDATE_EDITING_LONG_NOTE = "UPDATE_EDITING_LONG_NOTE" as const;
export const FINISH_EDITING_LONG_NOTE = "FINISH_EDITING_LONG_NOTE" as const;
export const REMOVE_LONG_NOTE = "REMOVE_LONG_NOTE" as const;
export const REMOVE_LONG_NOTES_ON_BAR = "REMOVE_LONG_NOTES_ON_BAR" as const;
export const REMOVE_OVERFLOWED_LONG_NOTES = "REMOVE_OVERFLOWED_LONG_NOTES" as const;

 export namespace LongNoteAction {
  export function addLongNote(longNote: LongNote) {
    return {
      type: ADD_LONG_NOTE,
      longNote,
    };
  }


  export function updateLongNote(longNote: LongNote) {
    return {
      type: UPDATE_LONG_NOTE,
      longNote,
    };
  }


  export function updateEditingLongNote(longNote: Partial<LongNote>) {
    return {
      type: UPDATE_EDITING_LONG_NOTE,
      longNote,
    };
  }


  export function finishEditingLongNote() {
    return {
      type: FINISH_EDITING_LONG_NOTE,
    };
  }


  export function removeLongNote(longNote: LongNote) {
    return {
      type: REMOVE_LONG_NOTE,
      longNote,
    };
  }


  export function removeLongNotesOnBar(barId: string) {
    return {
      type: REMOVE_LONG_NOTES_ON_BAR,
      barId,
    };
  }


  export function removeOverflowedLongNotes(barId: string, beat: number) {
    return {
      type: REMOVE_OVERFLOWED_LONG_NOTES,
      barId,
      beat,
    };
  }

}


export type AddLongNoteAction = {
  type: typeof ADD_LONG_NOTE;
  longNote: LongNote;
};


export type UpdateLongNoteAction = {
  type: typeof UPDATE_LONG_NOTE;
  longNote: LongNote;
};


export type UpdateEditingLongNoteAction = {
  type: typeof UPDATE_EDITING_LONG_NOTE;
  longNote: Partial<LongNote>;
};


export type FinishEditingLongNoteAction = {
  type: typeof FINISH_EDITING_LONG_NOTE;
};


export type RemoveLongNoteAction = {
  type: typeof REMOVE_LONG_NOTE;
  longNote: LongNote;
};


export type RemoveLongNotesOnBarAction = {
  type: typeof REMOVE_LONG_NOTES_ON_BAR;
  barId: string;
};


export type RemoveOverflowedLongNotesAction = {
  type: typeof REMOVE_OVERFLOWED_LONG_NOTES;
  barId: string;
  beat: number;
};


export type LongNoteActions = AddLongNoteAction | UpdateLongNoteAction | UpdateEditingLongNoteAction | FinishEditingLongNoteAction | RemoveLongNoteAction | RemoveLongNotesOnBarAction | RemoveOverflowedLongNotesAction

export interface ILongNoteReducers {
  ADD_LONG_NOTE(state: LongNoteState, action: AddLongNoteAction): LongNoteState;
  UPDATE_LONG_NOTE(state: LongNoteState, action: UpdateLongNoteAction): LongNoteState;
  UPDATE_EDITING_LONG_NOTE(state: LongNoteState, action: UpdateEditingLongNoteAction): LongNoteState;
  FINISH_EDITING_LONG_NOTE(state: LongNoteState, action: FinishEditingLongNoteAction): LongNoteState;
  REMOVE_LONG_NOTE(state: LongNoteState, action: RemoveLongNoteAction): LongNoteState;
  REMOVE_LONG_NOTES_ON_BAR(state: LongNoteState, action: RemoveLongNotesOnBarAction): LongNoteState;
  REMOVE_OVERFLOWED_LONG_NOTES(state: LongNoteState, action: RemoveOverflowedLongNotesAction): LongNoteState;
};