import { Record, List } from 'immutable';
import { LongNote } from '~NoteView/types';

export class LongNoteState extends Record<{
  longNotes: List<LongNote>;
  editingLongNote?: Partial<LongNote>;
}>({
  longNotes: List(),
  editingLongNote: undefined,
}) {};
