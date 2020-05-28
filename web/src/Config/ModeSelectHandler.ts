import { store, dispatch } from "~StateStore/store";
import { Mode } from "~NoteView/types";
import { CancellationToken, runAddLongNoteProcess } from "~runAddLongNoteProcess";
import { LongNoteAction } from "~StateStore/_gen/longNote_action.ts";

export class ModeSelectHandler {
  private prevMode?: Mode;
  private static longNoteProcessCancellationToken?: CancellationToken;
  private static runAddLongNoteProcessPromise?: ReturnType<typeof runAddLongNoteProcess>;
  constructor() {
    store.subscribe(() => {
      const { mode } = store.getState().modeState;
      const { prevMode } = this;
      this.prevMode = mode;
      ModeSelectHandler.onModeChanged(prevMode, mode);
    });
  }

  private static onModeChanged(previousMode: Mode | undefined, nextMode: Mode) {
    if (previousMode !== nextMode) {
      console.log(`mode changed. ${previousMode}-> ${nextMode}`);
      if (previousMode === 'longNoteEdit') {
        this.cancelAddLongNoteProcess();
      }
      if (nextMode === 'longNoteEdit' && !this.runAddLongNoteProcessPromise) {
        this.initRunAddLongNoteProcess();
      }
    }
  }

  private static initRunAddLongNoteProcess() {
    this.longNoteProcessCancellationToken = new CancellationToken();
    this.runAddLongNoteProcessPromise = runAddLongNoteProcess(this.longNoteProcessCancellationToken)
      .catch((reason) => {
        if (reason !== 'token canceled' && reason.message !== 'canceled') {
          throw reason;
        }
        this.cancelAddLongNoteProcess();
      })
      .finally(() => {
        if (store.getState().modeState.mode === 'longNoteEdit') {
          this.initRunAddLongNoteProcess();
        }
      });
  }

  public static cancelAddLongNoteProcess() {
    this.longNoteProcessCancellationToken?.cancel();
    this.runAddLongNoteProcessPromise = undefined;
    dispatch(LongNoteAction.finishEditingLongNote());
  }
}