import { ConfigState } from './config_state'

///BEGIN

export const SET_GUIDE_BEAT = "SET_GUIDE_BEAT" as const;
export const SET_DEFAULT_BAR_BEAT = "SET_DEFAULT_BAR_BEAT" as const;

 export namespace ConfigAction {
  export function setGuideBeat(guideBeat: number) {
    return {
      type: SET_GUIDE_BEAT,
      guideBeat,
    };
  }


  export function setDefaultBarBeat(beat: number) {
    return {
      type: SET_DEFAULT_BAR_BEAT,
      beat,
    };
  }

}


export type SetGuideBeatAction = {
  type: typeof SET_GUIDE_BEAT;
  guideBeat: number;
};


export type SetDefaultBarBeatAction = {
  type: typeof SET_DEFAULT_BAR_BEAT;
  beat: number;
};


export type ConfigActions = SetGuideBeatAction | SetDefaultBarBeatAction

export interface IConfigReducers {
  SET_GUIDE_BEAT(state: ConfigState, action: SetGuideBeatAction): ConfigState;
  SET_DEFAULT_BAR_BEAT(state: ConfigState, action: SetDefaultBarBeatAction): ConfigState;
};