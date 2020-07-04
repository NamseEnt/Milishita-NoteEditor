import { RootState, dispatch, store } from "~StateStore/store";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { ConfigAction } from "~StateStore/_gen/config_action.ts";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";
import { ModeAction } from "~StateStore/_gen/mode_action.ts";
import { PlayerAction } from "~StateStore/_gen/player_action.ts";
import { SelectNoteAction } from "~StateStore/_gen/selectNote_action.ts";
import { batchActions } from "redux-batched-actions";

type EditHistoryOption = {
  limit?: number,
}

export function dispatchAllStates(state: RootState): void {
  dispatch(batchActions([
    BarAction.setBarState(state.barState),
    ConfigAction.setConfigState(state.configState),
    LongNoteAction.setLongNoteState(state.longNoteState),
    ModeAction.setModeState(state.modeState),
    PlayerAction.setPlayerState(state.playerState),
    SelectNoteAction.setSelectNoteState(state.selectNoteState),
  ]));
}

class EditHistory {
  constructor(option?: EditHistoryOption) {
    this.limit = option?.limit || 50;
  }

  private limit: number = 0;

  private future: RootState[] = [];

  private past: RootState[] = [];

  public push(): void {
    this.past.push(store.getState());

    while (this.past.length > this.limit) {
      this.past.shift();
    }

    if (this.future.length) {
      this.future = [];
    }
  }

  public undo(): void {
    const pastState = this.past.pop();
    if (!pastState) {
      return;
    }

    this.future.push(store.getState());
    dispatchAllStates(pastState);
  }

  public redo(): void {
    const futureState = this.future.pop();
    if (!futureState) {
      return;
    }

    this.past.push(store.getState());
    dispatchAllStates(futureState);
  }
}

export default new EditHistory();
