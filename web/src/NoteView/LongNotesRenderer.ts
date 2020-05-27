import Drawable from "./Drawable";
import { LongNote, Position } from "./types";
import { getXY } from "~utils/bar";
import { List } from "immutable";

type LongNotesRendererProps = {
  longNotes: List<LongNote>;
  editingLongNote?: Partial<LongNote>;
  guideDotOnMouse?: Position;
}

export class LongNotesRenderer extends Drawable<LongNotesRendererProps> {
  constructor(
    props: LongNotesRendererProps) {
    super({ x: 0, y: 0, width: 0, height: 0 }, props);
  }

  private getPositions(longNote: Partial<LongNote>): Position[] {
    return [
      longNote.startNote?.position,
      ...(longNote.middlePoints || []),
      longNote.endNote?.position,
    ]
      .filter(x => x) as Position[];
  }

  render(context: CanvasRenderingContext2D): void {
    const { longNotes, editingLongNote } = this.props;

    longNotes.forEach(longNote => {
      this.renderLongNote(longNote, context);
    });
    if (editingLongNote) {
      if (!editingLongNote.endNote && this.props.guideDotOnMouse) {
        // get mouse guide Position
        const guidePosition: Position = this.props.guideDotOnMouse;
        const lastPosition = this.getPositions(editingLongNote).pop()!;
        this.renderLongNoteLine(lastPosition, guidePosition, context);
      }
      this.renderLongNote(editingLongNote, context);
    }
  }

  renderLongNote(longNote: Partial<LongNote>, context: CanvasRenderingContext2D): void {
    const positions = this.getPositions(longNote);
    for (let i = 0; i < positions.length - 1; i += 1) {
      const startPosition = positions[i];
      const endPosition = positions[i + 1];
      this.renderLongNoteLine(startPosition, endPosition, context);
    }
    if (longNote.middlePoints) {
      this.renderMiddlePoints(longNote.middlePoints, context);
    }
  }

  private renderMiddlePoints(middlePoints: Position[], context: CanvasRenderingContext2D): void {
    middlePoints.forEach(middlePoint => {
      const { x, y } = getXY(middlePoint);
      const radius = 5;
      context.fillStyle = 'black';
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });
  }

  private renderLongNoteLine(
    start: Position,
    end: Position,
    context: CanvasRenderingContext2D,
  ): void {
    const startXY = getXY(start);
    const endXY = getXY(end);

    context.lineWidth = 30;
    context.strokeStyle = 'lightpink'
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(startXY.x, startXY.y);
    context.lineTo(endXY.x, endXY.y);
    context.stroke();
  }
}