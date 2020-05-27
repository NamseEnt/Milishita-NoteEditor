import Drawable from "./Drawable";
import { BarRenderer } from "./BarRenderer";
import { store } from "~StateStore/store";
import { LongNotesRenderer } from "./LongNotesRenderer";
import { Position } from "./types";
import { CursorRenderer } from "./CursorRenderer";
import { CursorUpdater } from "./CursorUpdater";

export class BarListRenderer extends Drawable<{}> {
  private guideDotOnMouse?: Position;
  private readonly cursorUpdater = new CursorUpdater();

  constructor(
    x: number,
    y: number,
    width: number) {
    super(
      {
        x, y,
        width,
        height: () => {
          const { barState, configState } = store.getState();
          const { beatHeight } = configState;
          return barState.bars
            .reduce((prev, bar) => prev + bar.beat * beatHeight, 0)
        },
      },
      {},
    );
  }

  update() {
    this.cursorUpdater.update();
    this.clearChildren();

    const { guideDotOnMouse } = this;
    const {
      selectNoteState, barState, configState,
      longNoteState, modeState, playerState } = store.getState();
    const { barWidth, numberBoxWidth, guideBeat, keys, beatHeight } = configState;
    const { longNotes, editingLongNote } = longNoteState;
    const { cursor } = playerState;


    this.addChild(new LongNotesRenderer({
      longNotes,
      editingLongNote,
      guideDotOnMouse,
    }));


    const { bars } = barState;


    let y = 0;

    for (let barIndex = bars.size - 1; barIndex >= 0; barIndex -= 1) {
      const bar = bars.get(barIndex)!;
      const { selectedNoteId } = selectNoteState;
      const selectedNote = bar.notes.find(note => note.id === selectedNoteId);

      const barRenderer = new BarRenderer(0, y, this.width, {
        ...this.props,
        bar,
        barIndex: barIndex,
        guideDotOnMouse: guideDotOnMouse?.barId === bar.id
          ? guideDotOnMouse
          : undefined,
        onGuideDotOnMouse: (guideDot: Position) => { this.guideDotOnMouse = guideDot; },
        selectedNote: selectedNote,
        barWidth,
        numberBoxWidth,
        mode: modeState.mode,
        guideBeat,
        beatHeight,
        keys,
      });
      this.addChild(barRenderer);

      const barHeight = bar.beat * beatHeight;
      y += barHeight;
    }

    this.addChild(new CursorRenderer(
      0,
      this.width,
      30,
      {
        cursor,
      },
    ));
  }
}
