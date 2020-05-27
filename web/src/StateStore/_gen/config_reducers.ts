import { IConfigReducers, ConfigActions, SetGuideBeatAction } from "./config_action.ts";
import { ConfigState } from "./config_state";

export class ConfigReducers implements IConfigReducers {
  SET_GUIDE_BEAT(state: ConfigState, action: SetGuideBeatAction): ConfigState {
    return state.update('guideBeat', _ => action.guideBeat);
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
