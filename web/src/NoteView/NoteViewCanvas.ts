import { world } from "./world";
import { Button } from "./Button";
import { BarListRenderer } from "./BarListRenderer";
import { ScrollView } from "./ScrollView";
import { dispatch, store } from "~StateStore/store";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { runTestCode } from "./runTestCode";
import editHistory from "~utils/editHistory";

export default class NoteViewCanvas {
  private isDestroyed = false;
  private context: CanvasRenderingContext2D;
  private readonly barListRenderer: BarListRenderer;

  constructor(
    private readonly canvasElement: HTMLCanvasElement,
  ) {
    this.context = canvasElement.getContext('2d')
      || (() => { throw new Error('cannot get canvas 2d context') })();

    const mouseEventHandler = (event: MouseEvent) => {
      event.preventDefault();
      world.onMouseEvent(event);
    };
    canvasElement.onwheel = mouseEventHandler;
    canvasElement.onclick = mouseEventHandler;
    canvasElement.onmousedown = mouseEventHandler;
    canvasElement.onmouseenter = mouseEventHandler;
    canvasElement.onmouseleave = mouseEventHandler;
    canvasElement.onmousemove = mouseEventHandler;
    canvasElement.oncontextmenu = (event) => {
      mouseEventHandler(event);
      return false;
    };

    requestAnimationFrame(() => this.tick());

    const scrollView = new ScrollView({
      x: 5, y: 0,
      width: canvasElement.width - 10,
      height: canvasElement.height,
    }, {
      scrollPercent: 0,
    });

    const addBarButton = new Button({
      x: 0,
      y: 0,
      width: scrollView.width,
      height: 100
    }, {
      text: `+ 한 마디 추가`,
      handler: () => { this.addBar() },
    });
    scrollView.addChild(addBarButton);

    this.barListRenderer = new BarListRenderer(
      0,
      addBarButton.y + addBarButton.height,
      scrollView.width);
    scrollView.addChild(this.barListRenderer);

    world.addChild(scrollView);

    runTestCode();
  }

  public destory() {
    this.isDestroyed = true;
  }

  private addBar() {
    editHistory.push();
    dispatch(BarAction.pushNewBar(store.getState().configState.defaultBarBeat));
  }

  tick() {
    if (this.isDestroyed) {
      return;
    }
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    world.update();
    world.render(this.context);

    requestAnimationFrame(() => this.tick());
  }
}
