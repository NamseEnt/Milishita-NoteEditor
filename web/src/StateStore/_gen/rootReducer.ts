import { combineReducers } from "redux";
import { barReducer } from "./bar_reducers";
import { configReducer } from "./config_reducers";
import { longNoteReducer } from "./longNote_reducers";
import { modeReducer } from "./mode_reducers";
import { playerReducer } from "./player_reducers";
import { selectNoteReducer } from "./selectNote_reducers";

export const rootReducer = combineReducers({
  barState: barReducer,
  configState: configReducer,
  longNoteState: longNoteReducer,
  modeState: modeReducer,
  playerState: playerReducer,
  selectNoteState: selectNoteReducer,
});
