import { ModeState } from './mode_state'
import { Mode, NoteType } from '~NoteView/types';

///BEGIN

export const CHANGE_MODE = "CHANGE_MODE" as const;
export const CHANGE_NOTE_TYPE_MODE = "CHANGE_NOTE_TYPE_MODE" as const;
export const SET_MODE_STATE = "SET_MODE_STATE" as const;

 export namespace ModeAction {
  export function changeMode(mode: Mode) {
    return {
      type: CHANGE_MODE,
      mode,
    };
  }


  export function changeNoteTypeMode(mode: NoteType) {
    return {
      type: CHANGE_NOTE_TYPE_MODE,
      mode,
    };
  }


  export function setModeState(state: ModeState) {
    return {
      type: SET_MODE_STATE,
      state,
    };
  }

}


export type ChangeModeAction = {
  type: typeof CHANGE_MODE;
  mode: Mode;
};


export type ChangeNoteTypeModeAction = {
  type: typeof CHANGE_NOTE_TYPE_MODE;
  mode: NoteType;
};


export type SetModeStateAction = {
  type: typeof SET_MODE_STATE;
  state: ModeState;
};


export type ModeActions = ChangeModeAction | ChangeNoteTypeModeAction | SetModeStateAction

export interface IModeReducers {
  CHANGE_MODE(state: ModeState, action: ChangeModeAction): ModeState;
  CHANGE_NOTE_TYPE_MODE(state: ModeState, action: ChangeNoteTypeModeAction): ModeState;
  SET_MODE_STATE(state: ModeState, action: SetModeStateAction): ModeState;
};