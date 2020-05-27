import { Bar, Position, Action } from "~NoteView/types";
import { List, Record } from 'immutable';

export class BarState extends Record<{
  bars: List<Bar>,
  waitBarClickHandlers: List<Action<Position>>,
}>({
  bars: List(),
  waitBarClickHandlers: List(),
}) {};
