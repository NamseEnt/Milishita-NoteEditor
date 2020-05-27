import { Record, List } from "immutable";
import uuid from "~utils/uuid";

export type Action<T> = (arg: T) => any;

export const modes = ['singleNoteEdit', 'longNoteEdit',] as const;
export type Mode = typeof modes[number];

export class Bar extends Record<{
  id: string;
  notes: List<Note>,
  beat: number,
}>({
  id: undefined as unknown as string,
  notes: List(),
  beat: -1,
}) { };


export const noteTypes = ["tap", "left", "right", "up"] as const;
export type NoteType = typeof noteTypes[number];

export class Position extends Record<{
  barId: string;
  key: number;
  beat: number;
}>({
  barId: undefined as unknown as string,
  beat: -1,
  key: -1,
}) { };

export class Note extends Record<{
  id: string;
  type: NoteType;
  position: Position;
}>({
  id: undefined as unknown as string,
  type: "tap",
  position: new Position(),
}) { };

export class LongNote extends Record<{
  id: string;
  startNote: Note;
  endNote: Note;
  middlePoints: Position[],
}>({
  id: uuid(),
  endNote: undefined as unknown as Note,
  startNote: undefined as unknown as Note,
  middlePoints: [],
}) { };

export type WorldCoord = { worldX: number; worldY: number; };

export class Cursor extends Record<{
  beats: number,
}>({
  beats: 0,
}) { };

export class StartInfo extends Record<{
  startCursor: Cursor,
  startTime: Date,
}>({
  startCursor: new Cursor(),
  startTime: new Date(),
}) { };