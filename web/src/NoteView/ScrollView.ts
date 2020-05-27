import Drawable, { DynamicRect } from "./Drawable";

interface ScrollViewProps {
  scrollPercent: number; // TOP 0 ~  BOTTOM 1
};

export class ScrollView extends Drawable<ScrollViewProps> {
  private readonly scrollBarWidth: number = 10;

  getScrollRodHeight(): number {
    const contentHeight = this.getContentHeight();
    const scrollViewHeight = this.height;
    const rodSizeRatio = Math.min(scrollViewHeight / contentHeight, 1);
    const rodHeight = rodSizeRatio * scrollViewHeight;

    return rodHeight;
  }

  getScrollRodBottom(): number {
    const rodHeight = this.getScrollRodHeight();

    return (this.height - rodHeight) * (this.props.scrollPercent) + rodHeight;
  }

  public get scrollX(): number {
    return 0;
  }

  public get scrollY(): number {
    const contentHeight = this.getContentHeight();
    return (contentHeight - this.height) * this.props.scrollPercent;
  }

  scrollTo(scrollY: number): void {
    const contentHeight = this.getContentHeight();
    const scrollableHeight = contentHeight - this.height;
    if (scrollableHeight < 0) {
      return;
    }

    let scrollPercent = scrollY / scrollableHeight;

    scrollPercent = Math.max(Math.min(scrollPercent, 1), 0);
    this.props.scrollPercent = scrollPercent;
  }

  onMouseEvent(event: MouseEvent): void {
    if (event.type === 'wheel') {
      const wheelEvent = event as MouseWheelEvent;

      let scrollY = this.scrollY;
      scrollY += wheelEvent.deltaY;
      this.scrollTo(scrollY);
    }

    super.onMouseEvent(event);
  }

  private getContentHeight(): number {
    const contentHeight = this.getChildren().reduce((maxY, child) => Math.max(maxY, child.y + child.height), 0);

    return contentHeight;
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderContent(context);
    this.renderScrollBar(context);
  }

  renderContent(context: CanvasRenderingContext2D): void {
    const yOffset = (this.props.scrollPercent) * (-this.getContentHeight() + this.height);
    context.save();
    context.translate(0, yOffset);
    super.render(context);
    context.restore();
  }

  renderScrollBar(context: CanvasRenderingContext2D): void {
    this.renderScrollBarBorder(context);
    this.renderScrollBarRod(context);
  }

  renderScrollBarRod(context: CanvasRenderingContext2D) {
    const scrollX = this.x + this.width - this.scrollBarWidth;
    const rodBottom = this.getScrollRodBottom();
    const rodHeight = this.getScrollRodHeight();

    context.fillStyle = 'gray';
    context.fillRect(
      scrollX,
      this.y + rodBottom - rodHeight,
      this.scrollBarWidth,
      rodHeight);
  }

  renderScrollBarBorder(context: CanvasRenderingContext2D) {
    const scrollX = this.x + this.width - this.scrollBarWidth;
    context.strokeStyle = "black";
    context.strokeRect(
      scrollX,
      this.y,
      this.scrollBarWidth,
      this.height);
  }
}
