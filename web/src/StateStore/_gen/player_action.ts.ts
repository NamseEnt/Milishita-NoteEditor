import { PlayerState } from './player_state'
import { Cursor } from '~NoteView/types';

///BEGIN

export const PLAY = "PLAY" as const;
export const SET_CURSOR = "SET_CURSOR" as const;
export const STOP = "STOP" as const;
export const MOUSE_DOWN_ON_CURSOR = "MOUSE_DOWN_ON_CURSOR" as const;
export const MOUSE_UP_ON_CURSOR = "MOUSE_UP_ON_CURSOR" as const;
export const TOGGLE_PLAY = "TOGGLE_PLAY" as const;

 export namespace PlayerAction {
  export function play() {
    return {
      type: PLAY,
    };
  }


  export function setCursor(cursor: Cursor) {
    return {
      type: SET_CURSOR,
      cursor,
    };
  }


  export function stop() {
    return {
      type: STOP,
    };
  }


  export function mouseDownOnCursor() {
    return {
      type: MOUSE_DOWN_ON_CURSOR,
    };
  }


  export function mouseUpOnCursor() {
    return {
      type: MOUSE_UP_ON_CURSOR,
    };
  }


  export function togglePlay() {
    return {
      type: TOGGLE_PLAY,
    };
  }

}


export type PlayAction = {
  type: typeof PLAY;
};


export type SetCursorAction = {
  type: typeof SET_CURSOR;
  cursor: Cursor;
};


export type StopAction = {
  type: typeof STOP;
};


export type MouseDownOnCursorAction = {
  type: typeof MOUSE_DOWN_ON_CURSOR;
};


export type MouseUpOnCursorAction = {
  type: typeof MOUSE_UP_ON_CURSOR;
};


export type TogglePlayAction = {
  type: typeof TOGGLE_PLAY;
};


export type PlayerActions = PlayAction | SetCursorAction | StopAction | MouseDownOnCursorAction | MouseUpOnCursorAction | TogglePlayAction

export interface IPlayerReducers {
  PLAY(state: PlayerState, action: PlayAction): PlayerState;
  SET_CURSOR(state: PlayerState, action: SetCursorAction): PlayerState;
  STOP(state: PlayerState, action: StopAction): PlayerState;
  MOUSE_DOWN_ON_CURSOR(state: PlayerState, action: MouseDownOnCursorAction): PlayerState;
  MOUSE_UP_ON_CURSOR(state: PlayerState, action: MouseUpOnCursorAction): PlayerState;
  TOGGLE_PLAY(state: PlayerState, action: TogglePlayAction): PlayerState;
};