import * as redux from "redux";
import { rootReducer } from "./_gen/rootReducer";
import { ActionTypeCategory } from "./_gen/actionTypeCategory";
import editHistory from "~utils/editHistory";
import { enableBatching } from "redux-batched-actions";

export const store = redux.createStore(enableBatching(rootReducer));

export type RootState = ReturnType<typeof store.getState>;

export const dispatch: typeof store.dispatch = (action: any) => {
  const actionType = action.type;

  // console.log(`action : ${actionType}`, action);
  if (actionType === 'BATCHING_REDUCER.BATCH') {
    const batchedActionTypes = (action.payload as any[]).map(payloadItem => payloadItem.type) as string[];
    if (batchedActionTypes.some(batchedActionType => ActionTypeCategory.undoableActionTypes.includes(batchedActionType as any))) {
      editHistory.push();
    }
  } else if (ActionTypeCategory.undoableActionTypes.includes(actionType)) {
    editHistory.push();
  }
  return store.dispatch(action);
};

store.subscribe(() => {
  // console.log(store.getState().barState.toJS());
});