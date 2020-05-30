import { Position, Bar } from "~NoteView/types";
import { store } from "~StateStore/store";

export function getBarTop(targetBar: Bar): number {
  const { barState, configState } = store.getState();
  const { bars } = barState;
  const { beatHeight } = configState;

  let y = 0;
  for (let barIndex = barState.bars.size - 1; barIndex >= 0; barIndex -= 1) {
    const bar = bars.get(barIndex)!;
    if (bar === targetBar) {
      break;
    }

    const barHeight = bar.beat * beatHeight;
    y += barHeight;
  }

  return y;
}

export function getBarIndex(barId: string): number {
  return store.getState().barState.bars.findIndex(bar => bar.id === barId);
}

export function getBarIndexByBeats(beats: number): number {
  const bars = store.getState().barState.bars;

  let beatSum = 0;
  let barIndex = -1;
  const found = bars.some(bar => {
    barIndex += 1;
    beatSum += bar.beat;
    return beatSum > beats;
  })
  return found ? barIndex : -1
}

export function getBar(barId: string): Bar | undefined {
  return store.getState().barState.bars.find(bar => bar.id === barId);
}

export function getBarHeight(bar: Bar): number {
  return bar.beat * store.getState().configState.beatHeight;
}

export function getXY(position: Position): { x: number, y: number } {
  const { beatHeight, barWidth, keys, } = store.getState().configState;
  const { beat, barId, key, } = position;
  const bar = getBar(barId)!;

  const y = getBarTop(bar) + getBarHeight(bar) - beat * beatHeight;

  const x = barWidth / (keys + 1) * (key + 1);

  return {
    x,
    y,
  }
}

export function convertBarBeatToSecond(beat: number): number {
  const { bpm } = store.getState().configState;
  return beat / (bpm / 60);
}

export function convertBarSecondToBeat(second: number): number {
  const { bpm } = store.getState().configState;
  return second * (bpm / 60);
}
