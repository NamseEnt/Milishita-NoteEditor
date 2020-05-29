import { IModeReducers, ModeActions, ChangeModeAction, ChangeNoteTypeModeAction } from "./mode_action.ts";
import { ModeState } from "./mode_state";
import { CancellationToken } from "~runAddLongNoteProcess";

let longNoteProcessCancellationToken: CancellationToken | undefined;

export class ModeReducers implements IModeReducers {
  CHANGE_MODE(state: ModeState, action: ChangeModeAction): ModeState {
    return state.update('mode', (_) => action.mode);
  }
  CHANGE_NOTE_TYPE_MODE(state: ModeState, action: ChangeNoteTypeModeAction): ModeState {
    return state.update('noteTypeMode', (_) => action.mode)
  }
};

const reducers = new ModeReducers();

export function modeReducer(
  state: ModeState = new ModeState(),
  action: ModeActions,
): ModeState {
  const handler = (reducers as any)[action.type] as any;
  if (!handler) {
    return state;
  }
  return handler.bind(reducers)(state, action);
}
