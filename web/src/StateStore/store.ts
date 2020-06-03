import * as redux from "redux";
import { rootReducer } from "./_gen/rootReducer";
import { ActionTypeCategory } from "./_gen/actionTypeCategory";
import editHistory from "~utils/editHistory";

export const store = redux.createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;

export const dispatch: typeof store.dispatch = (action: any) => {
  // console.log(`action : ${action.type}`, action);
  if (ActionTypeCategory.undoableActionTypes.includes(action.type)) {
    editHistory.push();
    console.log('push!');
  }
  return store.dispatch(action);
};

store.subscribe(() => {
  // console.log(store.getState().barState.toJS());
});