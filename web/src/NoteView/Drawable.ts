import { WorldCoord } from "./types";

type ValueOrValueFunction<T> = T | (() => T)

export type DynamicRect = {
  x: ValueOrValueFunction<number>;
  y: ValueOrValueFunction<number>;
  width: ValueOrValueFunction<number>;
  height: ValueOrValueFunction<number>;
}

export default class Drawable<Props = any> {
  private readonly children: Drawable[] = [];
  private parent?: Drawable;

  constructor(
    private rect: DynamicRect,
    protected props: Props,
  ) {
  }

  public get x(): number {
    return (typeof (this.rect.x) === 'number') ? this.rect.x : this.rect.x();
  }

  public get y(): number {
    return (typeof (this.rect.y) === 'number') ? this.rect.y : this.rect.y();
  }

  public get height(): number {
    return (typeof (this.rect.height) === 'number') ? this.rect.height : this.rect.height();
  }

  public get width(): number {
    return (typeof (this.rect.width) === 'number') ? this.rect.width : this.rect.width();
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get scrollX(): number {
    return 0;
  }

  public get scrollY(): number {
    return 0;
  }

  public clearChildren(): void {
    while (this.children.pop()) { };
  }

  public getChildren(): ReadonlyArray<Drawable> {
    return this.children;
  }

  getWorldCoord(): WorldCoord {
    const parentWorldCoord = this.parent?.getWorldCoord();

    return {
      worldX: this.x + (parentWorldCoord?.worldX || 0) - (this.parent?.scrollX || 0),
      worldY: this.y + (parentWorldCoord?.worldY || 0) - (this.parent?.scrollY || 0),
    };
  }

  addChild(child: Drawable) {
    this.children.push(child);
    child.parent = this;
  }

  private static isPointInRect(
    rectX: number, rectY: number, width: number, height: number,
    pointX: number, pointY: number): boolean {
    return rectX <= pointX && pointX <= rectX + width
      && rectY <= pointY && pointY <= rectY + height;
  }

  private static isWorldCoordInDrawable(worldCoord: WorldCoord, drawable: Drawable): boolean {
    const { worldX, worldY } = drawable.getWorldCoord();

    const { worldX: targetWorldX, worldY: targetWorldY } = worldCoord;

    return Drawable.isPointInRect(worldX, worldY, drawable.width, drawable.height,
      targetWorldX, targetWorldY);
  }


  private static isMouseEventOnDrawable(event: MouseEvent, drawable: Drawable): boolean {
    return Drawable.isWorldCoordInDrawable({ worldX: event.offsetX, worldY: event.offsetY }, drawable);
  }

  onMouseEvent(event: MouseEvent) {
    event.stopPropagation = () => {
      (event as any).canceled = true;
    };

    const reveredChildren = [...this.children].reverse();
    for (const child of reveredChildren) {
      if ((event as any).canceled) {
        return;
      }
      if (Drawable.isMouseEventOnDrawable(event, child)) {
        child.onMouseEvent(event);
      }
    }
  }

  update(): void {
    this.children.forEach(child => {
      child.update();
    });
  }

  render(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.x, this.y);
    this.children.forEach(child => {
      context.save();
      child.render(context)
      context.restore();
    });
    context.restore();
  }
}
