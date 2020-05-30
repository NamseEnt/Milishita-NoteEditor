// event.code reference : https://keycode.info/

import { dispatch } from "~StateStore/store"
import { PlayerAction } from "~StateStore/_gen/player_action.ts"
import { ConfigAction } from "~StateStore/_gen/config_action.ts";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { ModeAction } from "~StateStore/_gen/mode_action.ts";

document.onkeydown = (event) => {
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

    case "KeyA": {
      dispatch(ModeAction.changeNoteTypeMode('left'));
    } break;

    case "KeyS": {
      dispatch(ModeAction.changeNoteTypeMode('tap'));
    } break;

    case "KeyD": {
      dispatch(ModeAction.changeNoteTypeMode('right'));
    } break;

    case "Space": {
      event.preventDefault();
      dispatch(PlayerAction.togglePlay());
    } break;

    default: break;
  }
}
