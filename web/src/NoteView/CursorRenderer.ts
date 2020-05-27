import Drawable from "./Drawable";
import { Cursor, Position } from "./types";
import { toPosition } from "~utils/cursor";
import { getXY } from "~utils/bar";

type CursorRendererProps = {
  cursor: Cursor,
}

export class CursorRenderer extends Drawable<CursorRendererProps> {
  constructor(
    x: number,
    width: number,
    height: number,
    props: CursorRendererProps) {
    super(
      {
        x,
        y: () => {
          const position = toPosition(this.props.cursor);
          if (!position) {
            return 0 - this.height / 2;
          }
          const { y } = getXY(new Position(position));
          return y - this.height / 2;
        },
        width,
        height,
      },
      props,
    );
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = "DarkOrange"
    const { y, width, height } = this;
    // shape : >--<

    const top = y;
    const bottom = y + height;
    const lineHeight = height * 0.2;
    const lineTop = y + height / 2 - lineHeight / 2;
    const lineBottom = lineTop + lineHeight;
    const triangleLine = height;

    context.beginPath();
    context.moveTo(0, top);
    context.lineTo(0, bottom);
    context.lineTo(triangleLine, lineTop);
    context.lineTo(width - triangleLine, lineTop);
    context.lineTo(width, bottom);
    context.lineTo(width, top);
    context.lineTo(width - triangleLine, lineBottom);
    context.lineTo(triangleLine, lineBottom);
    context.lineTo(0, top);
    context.closePath();
    context.fill();
  }

  onMouseEvent(event: MouseEvent): void {
    console.log(event);
    event.stopPropagation();
  }
}
