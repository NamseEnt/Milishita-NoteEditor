// event.code reference : https://keycode.info/

import { dispatch } from "~StateStore/store"
import { PlayerAction } from "~StateStore/_gen/player_action.ts"

document.onkeydown = (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    dispatch(PlayerAction.togglePlay());
  }
}
