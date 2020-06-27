import { dispatch, store } from "~StateStore/store";
import { ConfigAction } from "~StateStore/_gen/config_action.ts";
import player from "~Config/Player";

class CursorDragManager {
  private isDragging: boolean = false;

  private moveCursor(deltaY: number) {
    const {
      configState,
      playerState,
    } = store.getState();

    const { beatHeight } = configState;
    const { beats } = playerState.cursor;

    const deltaBeat = -deltaY / beatHeight;

    player.seek(beats + deltaBeat)
  }

  public startDragging() {
    const {
      configState,
      playerState,
    } = store.getState();
    const { autoScroll } = configState;
    const { isPlaying } = playerState;

    if (autoScroll) {
      dispatch(ConfigAction.setAutoScroll(false));
    }
    if (isPlaying) {
      player.stop();
    }

    this.isDragging = true;
  }

  public stopDragging() {
    this.isDragging = false;
  }

  public handleMouseMove(event: MouseEvent) {
    if (!this.isDragging) {
      return;
    }

    const deltaY = event.movementY
    this.moveCursor(deltaY);
  }

  public handleWheel(event: MouseWheelEvent) {
    if (!this.isDragging) {
      return;
    }

    const { deltaY } = event;

    this.moveCursor(deltaY);
  }
}

const cursorDragManager = new CursorDragManager();

export default cursorDragManager;
