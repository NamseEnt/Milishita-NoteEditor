import { Bar, Position, Action } from "~NoteView/types";
import { List, Record } from 'immutable';

export class BarState extends Record<{
  beats: number,
  bars: List<Bar>,
  waitBarClickHandlers: List<Action<Position>>,
}>({
  beats: 0,
  bars: List(),
  waitBarClickHandlers: List(),
}) {};
