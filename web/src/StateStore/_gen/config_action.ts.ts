import { ConfigState } from './config_state'

///BEGIN

export const SET_GUIDE_BEAT = "SET_GUIDE_BEAT" as const;

 export namespace ConfigAction {
  export function setGuideBeat(guideBeat: number) {
    return {
      type: SET_GUIDE_BEAT,
      guideBeat,
    };
  }

}


export type SetGuideBeatAction = {
  type: typeof SET_GUIDE_BEAT;
  guideBeat: number;
};


export type ConfigActions = SetGuideBeatAction

export interface IConfigReducers {
  SET_GUIDE_BEAT(state: ConfigState, action: SetGuideBeatAction): ConfigState;
};