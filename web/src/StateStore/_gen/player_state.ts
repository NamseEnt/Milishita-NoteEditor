import { Record } from 'immutable';
import { Cursor, StartInfo } from '~NoteView/types';

export class PlayerState extends Record<{
  cursor: Cursor,
  isPlaying: boolean,
  startInfo?: StartInfo,
  isCursorClicked: boolean,
}>({
  cursor: new Cursor({
    beats: 3,
    //beats: -14,
  }),
  isPlaying: false,
  startInfo: undefined,
  isCursorClicked: false,
}) {};
