import { IPlayerReducers, PlayerActions, PlayAction, SetCursorAction, StopAction, MouseDownOnCursorAction, MouseUpOnCursorAction, TogglePlayAction, PLAY, STOP, SetPlayerStateAction } from "./player_action.ts";
import { PlayerState } from "./player_state";
import { StartInfo } from "~NoteView/types";

export class PlayerReducers implements IPlayerReducers {
  TOGGLE_PLAY(state: PlayerState, action: TogglePlayAction): PlayerState {
    return state.isPlaying
      ? this.STOP(state, { type: STOP })
      : this.PLAY(state, { type: PLAY });
  }
  MOUSE_DOWN_ON_CURSOR(state: PlayerState, action: MouseDownOnCursorAction): PlayerState {
    throw new Error("Method not implemented.");
  }
  MOUSE_UP_ON_CURSOR(state: PlayerState, action: MouseUpOnCursorAction): PlayerState {
    throw new Error("Method not implemented.");
  }
  PLAY(state: PlayerState, action: PlayAction): PlayerState {
    return state
      .update('isPlaying', _ => true)
      .update('startInfo', _ => new StartInfo({
        startTime: new Date(),
        startCursor: state.cursor,
      }));
  }
  SET_CURSOR(state: PlayerState, action: SetCursorAction): PlayerState {
    return state.update('cursor', _ => action.cursor);
  }
  STOP(state: PlayerState, action: StopAction): PlayerState {
    return state
      .update('isPlaying', _ => false)
      .update('startInfo', _ => null);
  }
  SET_PLAYER_STATE(state: PlayerState, action: SetPlayerStateAction): PlayerState {
    return action.state;
  }
};

const reducers = new PlayerReducers();

export function playerReducer(
  state: PlayerState = new PlayerState(),
  action: PlayerActions,
): PlayerState {
  const handler = (reducers as any)[action.type] as any;
  if (!handler) {
    return state;
  }
  return handler.bind(reducers)(state, action);
}
