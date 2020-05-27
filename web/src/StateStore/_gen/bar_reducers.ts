import { IBarReducers, PushNewBarAction, AddBarAction, RemoveBarAction, AddNoteAction, RemoveNoteAction, BarActions, ChangeNoteTypeAction, WaitBarClickAction, ClickBarAction } from "./bar_action.ts";
import { BarState } from "./bar_state";
import { Bar, Note } from "~NoteView/types";
import uuid from "~utils/uuid";

export class BarReducers implements IBarReducers {
  WAIT_BAR_CLICK(state: BarState, action: WaitBarClickAction): BarState {
    return state.update('waitBarClickHandlers',
      waitBarClickHandlers => waitBarClickHandlers.push(action.trigger));
  }
  CLICK_BAR(state: BarState, action: ClickBarAction): BarState {
    const { waitBarClickHandlers } = state;
    waitBarClickHandlers.forEach(handler => handler(action.position));

    return state.update('waitBarClickHandlers',
      waitBarClickHandlers => waitBarClickHandlers.clear());
  }
  CHANGE_NOTE_TYPE(state: BarState, action: ChangeNoteTypeAction): BarState {
    const barIndex = state.bars.findIndex(bar => bar.notes.some(note => note.id === action.noteId));
    const noteIndex = state.bars.get(barIndex)?.notes.findIndex(x => x.id === action.noteId);
    return state.updateIn(['bars', barIndex, 'notes', noteIndex],
      (note: Note) => note.set('type', action.noteType));
  }
  PUSH_NEW_BAR(state: BarState, action: PushNewBarAction): BarState {
    return state.update('bars', bars => bars.push(new Bar({ id: uuid(), beat: 4 })));
  }
  ADD_BAR(state: BarState, action: AddBarAction): BarState {
    return state.update('bars', bars => bars.push(action.bar));
  }
  REMOVE_BAR(state: BarState, action: RemoveBarAction): BarState {
    return state.update('bars', bars => bars.remove(action.barIndex));
  }
  ADD_NOTE(state: BarState, action: AddNoteAction): BarState {
    return state.updateIn(['bars', action.barIndex, 'notes'],
      (notes: Note[]) => notes.push(action.note));
  }
  REMOVE_NOTE(state: BarState, action: RemoveNoteAction): BarState {
    return state.updateIn(['bars', action.barIndex, 'notes'],
      (notes: Note[]) => notes.filter(note => note.id !== action.note.id));
  }
}

const reducers = new BarReducers();

export function barReducer(
  state: BarState = new BarState(),
  action: BarActions,
): BarState {
  const handler = reducers[action.type] as any;
  if (!handler) {
    return state;
  }
  return handler.bind(reducers)(state, action);
}
