import Drawable, { DynamicRect } from "./Drawable";

interface ButtonProps {
  text: string;
  handler: Function;
};

export class Button extends Drawable<ButtonProps> {
  onMouseEvent(event: MouseEvent): void {
    if (event.type === 'click') {
      this.props.handler();
    }
  }

  render(context: CanvasRenderingContext2D): void {
    super.render(context);
    this.renderBorder(context);
    this.renderText(context);
  }

  renderBorder(context: CanvasRenderingContext2D) {
    context.strokeStyle = "black";
    context.fillStyle = "white";
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.closePath();
    context.fill();
    context.stroke();
  }

  renderText(context: CanvasRenderingContext2D) {
    context.font = `20px Arial`;
    context.textAlign = "center";
    context.textBaseline = 'middle';
    context.fillStyle = "black";
    context.fillText(this.props.text, this.x + this.width / 2, this.y + this.height / 2, this.width);
  }
}
