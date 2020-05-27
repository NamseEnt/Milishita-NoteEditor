import { ModeState } from './mode_state'
import { Mode } from '~NoteView/types';

///BEGIN

export const CHANGE_MODE = "CHANGE_MODE" as const;

 export namespace ModeAction {
  export function changeMode(mode: Mode) {
    return {
      type: CHANGE_MODE,
      mode,
    };
  }

}


export type ChangeModeAction = {
  type: typeof CHANGE_MODE;
  mode: Mode;
};


export type ModeActions = ChangeModeAction

export interface IModeReducers {
  CHANGE_MODE(state: ModeState, action: ChangeModeAction): ModeState;
};