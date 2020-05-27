import { Record } from 'immutable';
import { Mode } from '~NoteView/types';

export class ModeState extends Record<{
  mode: Mode,
}>({
  mode: "singleNoteEdit",
}) {};
