import { Bar, Note, NoteType, Position, Action } from '~NoteView/types';
import { BarState } from './bar_state'

///BEGIN

export const PUSH_NEW_BAR = "PUSH_NEW_BAR" as const;
export const INSERT_NEW_BAR = "INSERT_NEW_BAR" as const;
export const ADD_BAR = "ADD_BAR" as const;
export const REMOVE_BAR = "REMOVE_BAR" as const;
export const ADD_NOTE = "ADD_NOTE" as const;
export const REMOVE_NOTE = "REMOVE_NOTE" as const;
export const REMOVE_NOTES_ON_BAR = "REMOVE_NOTES_ON_BAR" as const;
export const CHANGE_NOTE_TYPE = "CHANGE_NOTE_TYPE" as const;
export const WAIT_BAR_CLICK = "WAIT_BAR_CLICK" as const;
export const CLICK_BAR = "CLICK_BAR" as const;

 export namespace BarAction {
  export function pushNewBar() {
    return {
      type: PUSH_NEW_BAR,
    };
  }


  export function insertNewBar(barIndex: number) {
    return {
      type: INSERT_NEW_BAR,
      barIndex,
    };
  }


  export function addBar(bar: Bar) {
    return {
      type: ADD_BAR,
      bar,
    };
  }


  export function removeBar(barIndex: number) {
    return {
      type: REMOVE_BAR,
      barIndex,
    };
  }


  export function addNote(barIndex: number, note: Note) {
    return {
      type: ADD_NOTE,
      barIndex,
      note,
    };
  }


  export function removeNote(barIndex: number, note: Note) {
    return {
      type: REMOVE_NOTE,
      barIndex,
      note,
    };
  }


  export function removeNotesOnBar(barIndex: number) {
    return {
      type: REMOVE_NOTES_ON_BAR,
      barIndex,
    };
  }


  export function changeNoteType(noteId: string, noteType: NoteType) {
    return {
      type: CHANGE_NOTE_TYPE,
      noteId,
      noteType,
    };
  }


  export function waitBarClick(trigger: Action<Position>) {
    return {
      type: WAIT_BAR_CLICK,
      trigger,
    };
  }


  export function clickBar(position: Position) {
    return {
      type: CLICK_BAR,
      position,
    };
  }

}


export type PushNewBarAction = {
  type: typeof PUSH_NEW_BAR;
};


export type InsertNewBarAction = {
  type: typeof INSERT_NEW_BAR;
  barIndex: number;
};


export type AddBarAction = {
  type: typeof ADD_BAR;
  bar: Bar;
};


export type RemoveBarAction = {
  type: typeof REMOVE_BAR;
  barIndex: number;
};


export type AddNoteAction = {
  type: typeof ADD_NOTE;
  barIndex: number;
  note: Note;
};


export type RemoveNoteAction = {
  type: typeof REMOVE_NOTE;
  barIndex: number;
  note: Note;
};


export type RemoveNotesOnBarAction = {
  type: typeof REMOVE_NOTES_ON_BAR;
  barIndex: number;
};


export type ChangeNoteTypeAction = {
  type: typeof CHANGE_NOTE_TYPE;
  noteId: string;
  noteType: NoteType;
};


export type WaitBarClickAction = {
  type: typeof WAIT_BAR_CLICK;
  trigger: Action<Position>;
};


export type ClickBarAction = {
  type: typeof CLICK_BAR;
  position: Position;
};


export type BarActions = PushNewBarAction | InsertNewBarAction | AddBarAction | RemoveBarAction | AddNoteAction | RemoveNoteAction | RemoveNotesOnBarAction | ChangeNoteTypeAction | WaitBarClickAction | ClickBarAction

export interface IBarReducers {
  PUSH_NEW_BAR(state: BarState, action: PushNewBarAction): BarState;
  INSERT_NEW_BAR(state: BarState, action: InsertNewBarAction): BarState;
  ADD_BAR(state: BarState, action: AddBarAction): BarState;
  REMOVE_BAR(state: BarState, action: RemoveBarAction): BarState;
  ADD_NOTE(state: BarState, action: AddNoteAction): BarState;
  REMOVE_NOTE(state: BarState, action: RemoveNoteAction): BarState;
  REMOVE_NOTES_ON_BAR(state: BarState, action: RemoveNotesOnBarAction): BarState;
  CHANGE_NOTE_TYPE(state: BarState, action: ChangeNoteTypeAction): BarState;
  WAIT_BAR_CLICK(state: BarState, action: WaitBarClickAction): BarState;
  CLICK_BAR(state: BarState, action: ClickBarAction): BarState;
};