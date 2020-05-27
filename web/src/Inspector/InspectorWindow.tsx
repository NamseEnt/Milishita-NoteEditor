import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { Form, DropdownItemProps } from 'semantic-ui-react';
import { noteTypes, NoteType } from '~NoteView/types';
import { BarAction } from '~StateStore/_gen/bar_action.ts';

export const SelectedNoteInspectorComponent = () => {
  const { selectedNote } = useSelector((state: RootState) => {
    const {selectedNoteId} = state.selectNoteState;
    console.log(state.barState.bars);
    const bar = state.barState.bars.find(bar => bar.notes.some(note => note.id === selectedNoteId));
    const selectedNote = bar?.notes.find(note => note.id === selectedNoteId);

    return {
      selectedNote,
    };
  });

  if (!selectedNote) {
    return null;
  }

  const noteTypeItems: DropdownItemProps[] = noteTypes.map(noteType => {
    return {
      key: noteType,
      text: noteType,
      value: noteType,
    };
  });

  const changeNoteType = (noteType: NoteType) => {
    dispatch(BarAction.changeNoteType(selectedNote.id, noteType));
  };

  return (
    <div>
      <Form>
        <Form.Group inline>
          <label>Types</label>
          <Form.Dropdown
            selection
            value={selectedNote.type}
            options={noteTypeItems}
            onChange={(_, data) => changeNoteType(data.value as NoteType)}
          />
        </Form.Group>
      </Form>
      {JSON.stringify(selectedNote, null, 2)}
    </div>
  );
}

export const InspectorWindow = () => {
  return (
    <div>
      <h1>Inspector</h1>
      <SelectedNoteInspectorComponent />
    </div>
  );
}