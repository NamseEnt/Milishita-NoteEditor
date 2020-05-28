import { Record } from 'immutable';
import { Mode, NoteType } from '~NoteView/types';

export class ModeState extends Record<{
  mode: Mode,
  noteTypeMode: NoteType,
}>({
  mode: "singleNoteEdit",
  noteTypeMode: "tap"
}) {};
