import { store, dispatch } from "~StateStore/store"
import { getCursor } from "~utils/cursor";
import { PlayerAction } from "~StateStore/_gen/player_action.ts";

export class CursorUpdater {
  update() {
    const { playerState } = store.getState();
    const { isPlaying } = playerState;
    if (!isPlaying || !playerState.startInfo) {
      return;
    }

    const cursor = getCursor(playerState.startInfo);
    dispatch(PlayerAction.setCursor(cursor));
  }
}