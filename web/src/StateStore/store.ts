import * as redux from "redux";
import { rootReducer } from "./_gen/rootReducer";
import { ActionTypeCategory } from "./_gen/actionTypeCategory";
import editHistory from "~utils/editHistory";
import { enableBatching } from "redux-batched-actions";
import storageManager from "~storageManager/storageManager";

export const store = redux.createStore(enableBatching(rootReducer));

export type RootState = ReturnType<typeof store.getState>;

let autoSaveTimeout: NodeJS.Timeout | null = null;

const actionHandlerMap: {
  category: readonly string[],
  handler: Function,
}[] = [
    {
      category: ActionTypeCategory.undoableActionTypes,
      handler: () => {
        editHistory.push();
      }
    },
    {
      category: ActionTypeCategory.autoSaveActionTypes,
      handler: () => {
        const {
          autoSave,
          autoSaveDelay,
        } = store.getState().configState;

        if (!autoSave) {
          return;
        }

        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout);
        }

        autoSaveTimeout = setTimeout(() => {
          if (storageManager.getItemInfo()) {
            storageManager.save();
            console.log('autosaved');
          }
        }, autoSaveDelay * 1000);
      }
    }
  ]

export const dispatch: typeof store.dispatch = (action: any) => {
  const actionType = action.type;

  // console.log(`action : ${actionType}`, action);
  actionHandlerMap.forEach(actionHandler => {
    if (actionType === 'BATCHING_REDUCER.BATCH') {
      const batchedActionTypes = (action.payload as any[]).map(payloadItem => payloadItem.type) as string[];
      if (batchedActionTypes.some(batchedActionType => actionHandler.category.includes(batchedActionType as any))) {
        actionHandler.handler();
      }
    } else if (actionHandler.category.includes(actionType)) {
      actionHandler.handler();
    }
  })

  return store.dispatch(action);
};

store.subscribe(() => {
  // console.log(store.getState().barState.toJS());
});