import { Bar, Note, NoteType, Position, Mode, LongNote } from "./types";
import Drawable from "./Drawable";
import { dispatch, store } from "~StateStore/store";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { SelectNoteAction } from "~StateStore/_gen/selectNote_action.ts";
import uuid from "~utils/uuid";
import { ModeSelectHandler } from "~Config/ModeSelectHandler";
import { removeNote } from "~utils/note";
import editHistory from "~utils/editHistory";

interface BarRendererProps {
  bar: Bar;
  barIndex: number;
  beatHeight: number;
  guideBeat: number;
  keys: number;
  guideDotOnMouse?: Position;
  onGuideDotOnMouse: (guideDot: Position) => void;
  selectedNote?: Note,
  barWidth: number,
  numberBoxWidth: number;
  mode: Mode;
}

export class BarRenderer extends Drawable<BarRendererProps> {
  constructor(
    x: number,
    y: number,
    width: number,
    props: BarRendererProps) {
    super({ x, y, width, height: () => props.bar.beat * props.beatHeight }, props);
  }

  private keyToX(key: number): number {
    return this.props.barWidth / (this.props.keys + 1) * (key + 1);
  }

  private xToKey(x: number): number {
    let key = x / this.props.barWidth * (this.props.keys + 1) - 1;
    key = Math.min(Math.max(key, 0), this.props.keys - 1);
    return key;
  }

  private KeyBeatToPoint(keyBeat: { key: number, beat: number }): { x: number, y: number } {
    const x = this.keyToX(keyBeat.key);
    const y = this.height - keyBeat.beat * this.props.beatHeight;
    return { x, y };
  }

  onMouseEvent(event: MouseEvent): void {
    this.updateGuideDotOnMouse(event);
    this.handleClick(event);
  }

  private handleClick(event: MouseEvent) {
    const { guideDotOnMouse, mode } = this.props;
    if (!guideDotOnMouse || !['click', 'contextmenu'].includes(event.type)) {
      return;
    }
    const { beat, key } = guideDotOnMouse;
    const beatKey = { beat, key };

    switch (event.button) {
      case 0: { // left click
        dispatch(BarAction.clickBar(new Position({
          barId: this.props.bar.id,
          beat,
          key,
        })));

        if (mode === 'longNoteEdit') {
          break;
        }

        const noteOnBeatKey = this.getNoteOnBeatKey(beatKey);
        if (noteOnBeatKey) {
          if (noteOnBeatKey === this.props.selectedNote) {
            this.deselectNote()
          } else {
            this.selectNote(noteOnBeatKey);
          }
        } else {
          this.addNote(beatKey);
        }
      } break;

      case 2: { // right click
        if (mode === 'longNoteEdit') {
          ModeSelectHandler.cancelAddLongNoteProcess();
        }

        const noteOnBeatKey = this.getNoteOnBeatKey(beatKey)
        if (!noteOnBeatKey) {
          break;
        }

        this.removeNote(noteOnBeatKey);
      } break;
    }
  }

  removeNote(note: Note) {
    editHistory.push();
    removeNote(note, this.props.barIndex);
  }

  getNoteOnBeatKey(beatKey: { beat: number; key: number; }): Note | undefined {
    return this.props.bar.notes.find(note =>
      note.position.beat === beatKey.beat
      && note.position.key === beatKey.key);
  }

  deselectNote() {
    dispatch(SelectNoteAction.deselectNote());
  }

  selectNote(note: Note) {
    dispatch(SelectNoteAction.selectNote(note.id));
  }

  addNote(beatKey: { beat: number; key: number; }) {
    const newNote = new Note({
      id: uuid(),
      position: new Position({
        ...beatKey,
        barId: this.props.bar.id,
      }),
      type: store.getState().modeState.noteTypeMode,
    });

    editHistory.push();
    dispatch(BarAction.addNote(this.props.barIndex, newNote));
    dispatch(SelectNoteAction.selectNote(newNote.id));
  }

  render(context: CanvasRenderingContext2D): void {
    context.translate(this.x, this.y);

    this.renderKeyLines(context);
    this.renderBar(context);
  }

  updateGuideDotOnMouse(event: MouseEvent): void {
    const mouseWorldCoord = { worldX: event.offsetX, worldY: event.offsetY };
    const myWorldCoord = this.getWorldCoord();

    const mouseLocalCoord = {
      x: mouseWorldCoord.worldX - myWorldCoord.worldX,
      y: mouseWorldCoord.worldY - myWorldCoord.worldY,
    };

    const guideDotOnMouse = this.localCoordToGuideDot(mouseLocalCoord.x, mouseLocalCoord.y);
    if (guideDotOnMouse) {
      this.props.onGuideDotOnMouse(guideDotOnMouse);
    }
  }


  private localCoordToGuideDot(x: number, y: number): Position | undefined {
    const beat = this.getBeatYList(this.props.guideBeat)
      .map((beatY, index) => ({ beatY, index }))
      .reduce((prev, next) => {
        return Math.abs(prev.beatY - y) < Math.abs(next.beatY - y) ? prev : next;
      })
      .index * this.props.guideBeat;

    const key = Math.round(this.xToKey(x));

    return new Position({
      barId: this.props.bar.id,
      key,
      beat,
    });
  }

  private renderKeyLines(context: CanvasRenderingContext2D) {
    const {
      keys,
    } = this.props;

    context.strokeStyle = "gray";
    context.lineWidth = 1;
    context.beginPath();
    for (let key = 0; key < keys; key += 1) {
      const x = this.keyToX(key);
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
    }
    context.stroke();
  }

  private renderBar(context: CanvasRenderingContext2D) {
    this.renderBarBorder(context);
    this.renderMainBeatLines(context);
    this.renderGuideBeatLines(context);
    this.renderBarNumberBox(context);

    this.renderSameBeatGuideLines(context);

    this.renderGuideDotOnMouse(context);

    this.renderNotes(context);
  }

  private renderSameBeatGuideLines(context: CanvasRenderingContext2D) {
    const sameBeatNoteContainers: Array<{
      beat: number,
      notes: Note[],
    }> = [];

    this.props.bar.notes.forEach(note => {
      let container = sameBeatNoteContainers.find(container => container.beat === note.position.beat);
      if (container) {
        container.notes.push(note);
      } else {
        container = { beat: note.position.beat, notes: [note] };
        sameBeatNoteContainers.push(container);
      }
    });

    sameBeatNoteContainers.forEach(container => {
      this.renderSameBeatGuideLine(container.beat, container.notes, context);
    });
  }

  private renderSameBeatGuideLine(beat: number, notes: Note[], context: CanvasRenderingContext2D) {
    if (notes.length < 2) {
      return;
    }

    const mostLeftNote = notes.reduce((prev, note) => {
      return prev.position.key < note.position.key ? prev : note;
    });

    const mostRightNote = notes.reduce((prev, note) => {
      return prev.position.key > note.position.key ? prev : note;
    });

    const { x: leftX } = this.KeyBeatToPoint(mostLeftNote.position);
    const { x: rightX, y } = this.KeyBeatToPoint(mostRightNote.position);

    context.strokeStyle = "black";
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(leftX, y);
    context.lineTo(rightX, y);
    context.stroke();
  }

  private renderNotes(context: CanvasRenderingContext2D) {
    this.props.bar.notes.forEach(note => {
      const isSelectedNote = note === this.props.selectedNote;
      if (isSelectedNote) {
        this.renderSelectedNote(note, context);
      } else {
        this.renderNotSelectedNote(note, context);
      }
    });
  }

  private renderSelectedNote(note: Note, context: CanvasRenderingContext2D) {
    const { x, y } = this.KeyBeatToPoint(note.position);
    this.fillCircle(x, y, 18, 'purple', context);
    this.fillCircle(x, y, 14, 'white', context);
    this.fillCircle(x, y, 10, this.getInnerColor(note.type), context);
    this.renderNoteSign(note, context);

    context.fillStyle = "white";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = "14px Arial";
    // context.fillText('✓', x, y);
  }

  private renderNotSelectedNote(note: Note, context: CanvasRenderingContext2D): void {
    const { x, y } = this.KeyBeatToPoint(note.position);
    this.fillCircle(x, y, 14, 'black', context);
    this.fillCircle(x, y, 12, 'white', context);
    this.fillCircle(x, y, 10, this.getInnerColor(note.type), context);
    this.renderNoteSign(note, context);
  }

  private getInnerColor(noteType: NoteType): string {
    const noteTypeColorDictionary: { [key in NoteType]: string } = {
      'tap': 'red',
      'left': 'blue',
      'right': 'gold',
      'up': 'green',
    };

    return noteTypeColorDictionary[noteType];
  }

  private getSign(noteType: NoteType): string {
    const noteTypeSignDictionary: { [key in NoteType]: string } = {
      'tap': '',
      'left': '←',
      'right': '→',
      'up': '↑',
    };

    return noteTypeSignDictionary[noteType];
  }

  private renderNoteSign(note: Note, context: CanvasRenderingContext2D): void {
    const { x, y } = this.KeyBeatToPoint(note.position);
    const { type } = note;
    const sign = this.getSign(type);

    context.fillStyle = "white";
    context.font = `24px Arial bold`;
    context.textBaseline = "middle";
    context.textAlign = 'center';
    context.fillText(sign, x, y + 2);
  }

  private fillCircle(
    x: number, y: number, radius: number,
    fillStyle: string | CanvasGradient | CanvasPattern,
    context: CanvasRenderingContext2D) {

    context.fillStyle = fillStyle;
    context.beginPath();
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    context.fill();
  }

  private renderGuideBeatLines(context: CanvasRenderingContext2D) {
    this.renderBeatLines(context, this.props.guideBeat, 'gray', 1);
  }

  private renderMainBeatLines(context: CanvasRenderingContext2D) {
    this.renderBeatLines(context, 1, 'black', 1);
  }

  private getBeatYList(perBeat: number): number[] {
    const { bar } = this.props;
    const yList: number[] = [];
    for (let i = 0; i < bar.beat; i += perBeat) {
      const y = (bar.beat - i) * this.props.beatHeight;
      yList.push(y);
    }

    return yList;
  }

  private renderBeatLines(context: CanvasRenderingContext2D,
    perBeat: number,
    strokeStyle: string | CanvasGradient | CanvasPattern, lineWidth: number,
  ) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.beginPath();

    this.getBeatYList(perBeat)
      .forEach(y => {
        context.moveTo(0, y);
        context.lineTo(this.props.barWidth, y);
      });

    context.stroke();
  }

  private renderBarBorder(context: CanvasRenderingContext2D) {
    const { beatHeight, bar } = this.props;
    const barHeight = bar.beat * beatHeight;

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, barHeight);
    context.lineTo(this.width, barHeight);
    context.lineTo(this.width, 0);
    context.stroke();
  }

  private renderBarNumberBox(context: CanvasRenderingContext2D) {
    const { beatHeight, bar } = this.props;
    const barHeight = bar.beat * beatHeight;

    const barNumberBoxX = this.right - this.props.numberBoxWidth;

    context.strokeStyle = "black";
    context.beginPath();
    context.rect(barNumberBoxX, 0, this.props.numberBoxWidth, barHeight);
    context.closePath();
    context.stroke();

    context.fillStyle = "black";
    context.font = `20px Arial`;
    context.textBaseline = "middle";
    context.textAlign = 'center';
    const centerX = this.right - (this.props.numberBoxWidth / 2);
    const middleY = barHeight / 2;
    context.fillText(this.props.barIndex.toString(), centerX, middleY, this.props.numberBoxWidth);
  }

  private renderGuideDotOnMouse(context: CanvasRenderingContext2D) {
    const { guideDotOnMouse } = this.props
    if (!guideDotOnMouse) {
      return;
    }

    const point = this.KeyBeatToPoint(guideDotOnMouse);

    context.fillStyle = 'red';
    context.beginPath();
    context.ellipse(point.x, point.y, 20, 20, 0, 0, Math.PI * 2);
    context.fill();
  }
}
