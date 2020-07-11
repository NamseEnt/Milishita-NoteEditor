import { ConfigState } from './config_state'

///BEGIN

export const SET_BEAT_HEIGHT = "SET_BEAT_HEIGHT" as const;
export const SET_KEYS = "SET_KEYS" as const;
export const SET_GUIDE_BEAT = "SET_GUIDE_BEAT" as const;
export const SET_BPM = "SET_BPM" as const;
export const SET_DEFAULT_BAR_BEAT = "SET_DEFAULT_BAR_BEAT" as const;
export const SET_AUTO_SCROLL = "SET_AUTO_SCROLL" as const;
export const SET_AUTO_SAVE = "SET_AUTO_SAVE" as const;
export const SET_AUTO_SAVE_DELAY = "SET_AUTO_SAVE_DELAY" as const;
export const SET_CONFIG_STATE = "SET_CONFIG_STATE" as const;
export const APPLY_STORAGE_ITEM_TO_CONFIG_STATE = "APPLY_STORAGE_ITEM_TO_CONFIG_STATE" as const;
export const SET_DEFAULT_APPEAR_BEFORE_BEATS = "SET_DEFAULT_APPEAR_BEFORE_BEATS" as const;

 export namespace ConfigAction {
  export function setBeatHeight(beatHeight: number) {
    return {
      type: SET_BEAT_HEIGHT,
      beatHeight,
    };
  }


  export function setKeys(keys: number) {
    return {
      type: SET_KEYS,
      keys,
    };
  }


  export function setGuideBeat(guideBeat: number) {
    return {
      type: SET_GUIDE_BEAT,
      guideBeat,
    };
  }


  export function setBpm(bpm: number) {
    return {
      type: SET_BPM,
      bpm,
    };
  }


  export function setDefaultBarBeat(beat: number) {
    return {
      type: SET_DEFAULT_BAR_BEAT,
      beat,
    };
  }


  export function setAutoScroll(auto: boolean) {
    return {
      type: SET_AUTO_SCROLL,
      auto,
    };
  }


  export function setAutoSave(auto: boolean) {
    return {
      type: SET_AUTO_SAVE,
      auto,
    };
  }


  export function setAutoSaveDelay(second: number) {
    return {
      type: SET_AUTO_SAVE_DELAY,
      second,
    };
  }


  export function setConfigState(state: ConfigState) {
    return {
      type: SET_CONFIG_STATE,
      state,
    };
  }


  export function applyStorageItemToConfigState(keys: number, bpm: number) {
    return {
      type: APPLY_STORAGE_ITEM_TO_CONFIG_STATE,
      keys,
      bpm,
    };
  }


  export function setDefaultAppearBeforeBeats(beat: number) {
    return {
      type: SET_DEFAULT_APPEAR_BEFORE_BEATS,
      beat,
    };
  }

}


export type SetBeatHeightAction = {
  type: typeof SET_BEAT_HEIGHT;
  beatHeight: number;
};


export type SetKeysAction = {
  type: typeof SET_KEYS;
  keys: number;
};


export type SetGuideBeatAction = {
  type: typeof SET_GUIDE_BEAT;
  guideBeat: number;
};


export type SetBpmAction = {
  type: typeof SET_BPM;
  bpm: number;
};


export type SetDefaultBarBeatAction = {
  type: typeof SET_DEFAULT_BAR_BEAT;
  beat: number;
};


export type SetAutoScrollAction = {
  type: typeof SET_AUTO_SCROLL;
  auto: boolean;
};


export type SetAutoSaveAction = {
  type: typeof SET_AUTO_SAVE;
  auto: boolean;
};


export type SetAutoSaveDelayAction = {
  type: typeof SET_AUTO_SAVE_DELAY;
  second: number;
};


export type SetConfigStateAction = {
  type: typeof SET_CONFIG_STATE;
  state: ConfigState;
};


export type ApplyStorageItemToConfigStateAction = {
  type: typeof APPLY_STORAGE_ITEM_TO_CONFIG_STATE;
  keys: number;
  bpm: number;
};


export type SetDefaultAppearBeforeBeatsAction = {
  type: typeof SET_DEFAULT_APPEAR_BEFORE_BEATS;
  beat: number;
};


export type ConfigActions = SetBeatHeightAction | SetKeysAction | SetGuideBeatAction | SetBpmAction | SetDefaultBarBeatAction | SetAutoScrollAction | SetAutoSaveAction | SetAutoSaveDelayAction | SetConfigStateAction | ApplyStorageItemToConfigStateAction | SetDefaultAppearBeforeBeatsAction

export interface IConfigReducers {
  SET_BEAT_HEIGHT(state: ConfigState, action: SetBeatHeightAction): ConfigState;
  SET_KEYS(state: ConfigState, action: SetKeysAction): ConfigState;
  SET_GUIDE_BEAT(state: ConfigState, action: SetGuideBeatAction): ConfigState;
  SET_BPM(state: ConfigState, action: SetBpmAction): ConfigState;
  SET_DEFAULT_BAR_BEAT(state: ConfigState, action: SetDefaultBarBeatAction): ConfigState;
  SET_AUTO_SCROLL(state: ConfigState, action: SetAutoScrollAction): ConfigState;
  SET_AUTO_SAVE(state: ConfigState, action: SetAutoSaveAction): ConfigState;
  SET_AUTO_SAVE_DELAY(state: ConfigState, action: SetAutoSaveDelayAction): ConfigState;
  SET_CONFIG_STATE(state: ConfigState, action: SetConfigStateAction): ConfigState;
  APPLY_STORAGE_ITEM_TO_CONFIG_STATE(state: ConfigState, action: ApplyStorageItemToConfigStateAction): ConfigState;
  SET_DEFAULT_APPEAR_BEFORE_BEATS(state: ConfigState, action: SetDefaultAppearBeforeBeatsAction): ConfigState;
};