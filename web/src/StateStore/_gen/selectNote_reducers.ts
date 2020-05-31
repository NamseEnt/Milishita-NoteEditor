import { ISelectNoteReducers, SelectNoteAction, DeselectNoteAction, SelectNoteActions, SetSelectNoteStateAction } from "./selectNote_action.ts";
import { SelectNoteState } from "./selectNote_state";

export class SelectNoteReducers implements ISelectNoteReducers {
  SELECT_NOTE(state: SelectNoteState, action: SelectNoteAction): SelectNoteState {
    return {
      ...state,
      selectedNoteId: action.noteId,
    };
  }
  DESELECT_NOTE(state: SelectNoteState, action: DeselectNoteAction): SelectNoteState {
    return {
      ...state,
      selectedNoteId: undefined,
    };
  }
  SET_SELECT_NOTE_STATE(state: SelectNoteState, action: SetSelectNoteStateAction): SelectNoteState {
    return action.state;
  }
};

const reducers = new SelectNoteReducers();

const initialState: SelectNoteState = {
};

export function selectNoteReducer(
  state: SelectNoteState = initialState,
  action: SelectNoteActions,
): SelectNoteState {
  const handler = reducers[action.type] as any;
  if (!handler) {
    return state;
  }
  return handler.bind(reducers)(state, action);
}
