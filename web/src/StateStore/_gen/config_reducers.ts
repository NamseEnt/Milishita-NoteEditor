import { IConfigReducers, ConfigActions, SetGuideBeatAction, SetDefaultBarBeatAction, SetConfigStateAction, SetAutoScrollAction, SetBpmAction, SetKeysAction, SetBeatHeightAction } from "./config_action.ts";
import { ConfigState } from "./config_state";

export class ConfigReducers implements IConfigReducers {
  SET_BEAT_HEIGHT(state: ConfigState, action: SetBeatHeightAction): ConfigState {
    return state.update('beatHeight', _ => action.beatHeight);
  }
  SET_KEYS(state: ConfigState, action: SetKeysAction): ConfigState {
    return state.update('keys', _ => action.keys);
  }
  SET_GUIDE_BEAT(state: ConfigState, action: SetGuideBeatAction): ConfigState {
    return state.update('guideBeat', _ => action.guideBeat);
  }
  SET_BPM(state: ConfigState, action: SetBpmAction): ConfigState {
    return state.update('bpm', _ => action.bpm);
  }
  SET_DEFAULT_BAR_BEAT(state: ConfigState, action: SetDefaultBarBeatAction): ConfigState {
    return state.update('defaultBarBeat', _ => action.beat);
  }
  SET_CONFIG_STATE(state: ConfigState, action: SetConfigStateAction): ConfigState {
    return action.state;
  }
  SET_AUTO_SCROLL(state: ConfigState, action: SetAutoScrollAction): ConfigState {
    return state.update('autoScroll', _ => action.auto);
  }
};

const reducers = new ConfigReducers();

export function configReducer(
  state: ConfigState = new ConfigState(),
  action: ConfigActions,
): ConfigState {
  const handler = (reducers as any)[action.type] as any;
  if (!handler) {
    return state;
  }
  return handler.bind(reducers)(state, action);
}
