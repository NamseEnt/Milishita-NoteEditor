// event.code reference : https://keycode.info/

import { dispatch } from "~StateStore/store"
import { ModeAction } from "~StateStore/_gen/mode_action.ts";
import editHistory from "~utils/editHistory";
import player from "~Config/Player";
import storageManager from "~storageManager/storageManager";

export default function handleKeyDown(event: KeyboardEvent) {
  const {
    altKey: alt,
    ctrlKey: ctrl,
    shiftKey: shift,
    code,
  } = event;

  switch (code) {
    case "KeyQ": {
      dispatch(ModeAction.changeMode('singleNoteEdit'));
    } break;

    case "KeyW": {
      dispatch(ModeAction.changeNoteTypeMode('up'));
    } break;

    case "KeyE": {
      dispatch(ModeAction.changeMode('longNoteEdit'));
    } break;

    case "KeyR": {
      if (ctrl) {
        event.preventDefault();
      }
      if (shift) {
        editHistory.redo();
        break;
      }
      editHistory.undo();
    } break;

    case "KeyA": {
      dispatch(ModeAction.changeNoteTypeMode('left'));
    } break;

    case "KeyS": {
      if (ctrl) {
        event.preventDefault();
        if (storageManager.getItemInfo()) {
          storageManager.save();
        }
        break;
      }
      dispatch(ModeAction.changeNoteTypeMode('tap'));
    } break;

    case "KeyD": {
      dispatch(ModeAction.changeNoteTypeMode('right'));
    } break;

    case "KeyZ": {
      if (ctrl) {
        if (shift) {
          editHistory.redo();
          break;
        }
        editHistory.undo();
        break;
      }
    } break;

    case "Space": {
      event.preventDefault();
      player.togglePlay();
    } break;

    default: break;
  }
}
