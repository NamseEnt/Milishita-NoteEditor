import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { noteTypes, NoteType } from '~NoteView/types';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { Divider, MenuItem, Select, FormControl, InputLabel, CardContent } from '@material-ui/core';


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

  const changeNoteType = (noteType: NoteType) => {
    dispatch(BarAction.changeNoteType(selectedNote.id, noteType));
  };

  const dropdownItems = noteTypes.map(noteType => {
    return <MenuItem
      key={`selected-note-${noteType}`}
      value={noteType}
      disabled={selectedNote.type === noteType}
      selected={selectedNote.type === noteType}
    >{noteType}</MenuItem>
  });

  return (
    <CardContent>
      <FormControl fullWidth>
        <InputLabel id="selected-note-type-label">Note Type</InputLabel>
        <Select
          labelId='selected-note-type-label'
          value={selectedNote.type}
          onChange={(event: React.ChangeEvent<{value: unknown}>) => changeNoteType(event.target.value as NoteType)}
        >
          {dropdownItems}
        </Select>
      </FormControl>
      <Divider />
      <CardContent>
        <pre>{JSON.stringify(selectedNote, null, 2)}</pre>
      </CardContent>
    </CardContent>
  );
}