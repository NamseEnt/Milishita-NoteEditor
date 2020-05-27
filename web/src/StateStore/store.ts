import * as redux from "redux";
import { rootReducer } from "./_gen/rootReducer";

export const store = redux.createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;

export const dispatch: typeof store.dispatch = (action: any) => {
  // console.log(`action : ${action.type}`, action);
  return store.dispatch(action);
};

store.subscribe(() => {
  // console.log(store.getState().barState.toJS());
});