import { world } from "./world";
import { Button } from "./Button";
import { BarListRenderer } from "./BarListRenderer";
import { ScrollView } from "./ScrollView";
import { dispatch, store } from "~StateStore/store";
import { BarAction } from "~StateStore/_gen/bar_action.ts";
import { runTestCode } from "./runTestCode";
import cursorDragManager from "./cursorDragManager";

export default class NoteViewCanvas {
  private isDestroyed = false;
  private context: CanvasRenderingContext2D;
  private readonly scrollView: ScrollView;
  private readonly addBarButton: Button;
  private readonly barListRenderer: BarListRenderer;

  constructor(
    private readonly canvasElement: HTMLCanvasElement,
  ) {
    this.context = canvasElement.getContext('2d')
      || (() => { throw new Error('cannot get canvas 2d context') })();

    const mouseEventHandler = (event: MouseEvent) => {
      event.preventDefault();
      world.onMouseEvent(event);

      switch(event.type) {
        case 'wheel': {
          const wheelEvent = event as MouseWheelEvent;
          cursorDragManager.handleWheel(wheelEvent);
        } break;

        case 'mousemove': {
          cursorDragManager.handleMouseMove(event);
        } break;

        case 'mouseup':
        case 'mouseleave': {
          cursorDragManager.stopDragging();
        } break;

        default: break;
      }
    };
    canvasElement.onwheel = mouseEventHandler;
    canvasElement.onclick = mouseEventHandler;
    canvasElement.onmousedown = mouseEventHandler;
    canvasElement.onmouseenter = mouseEventHandler;
    canvasElement.onmouseleave = mouseEventHandler;
    canvasElement.onmousemove = mouseEventHandler;
    canvasElement.onmouseup = mouseEventHandler;
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
    this.scrollView = scrollView;

    const addBarButton = new Button({
      x: 0,
      y: 0,
      width: scrollView.width,
      height: 100
    }, {
      text: `+ 한 마디 추가`,
      handler: () => { this.addBar() },
    });
    this.addBarButton = addBarButton;
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
    dispatch(BarAction.pushNewBar(store.getState().configState.defaultBarBeat));
  }

  private autoScroll() {
    const {
      barState,
      playerState,
    } = store.getState();

    const { autoScroll } = store.getState().configState;

    if (autoScroll) {
      const { beats: totalBeats } = barState;
      const { beats: cursorBeats } = playerState.cursor;

      const playProgress = (totalBeats - cursorBeats) / totalBeats;
      const scrollViewHeight = this.scrollView.height;
      const addBarButtonHeight = this.addBarButton.height;
      const barListHeight = this.barListRenderer.height;
      const scrollY = barListHeight * playProgress + addBarButtonHeight - scrollViewHeight * 0.9;

      this.scrollView.scrollTo(scrollY);
    }
  }

  tick() {
    if (this.isDestroyed) {
      return;
    }

    world.update();

    const { autoScroll } = store.getState().configState;
    if (autoScroll) {
      this.autoScroll();
    }

    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    world.render(this.context);

    requestAnimationFrame(() => this.tick());
  }
}
