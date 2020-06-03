import { store } from "~StateStore/store";
import { Mode } from "~NoteView/types";
import { cancleEditingLongNote } from "~NoteView/longNoteEditHandler";

export class ModeSelectHandler {
  private prevMode?: Mode;
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
        cancleEditingLongNote();
      }
    }
  }
}