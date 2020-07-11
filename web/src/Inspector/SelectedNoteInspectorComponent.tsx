import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch, store } from '~StateStore/store';
import { noteTypes, NoteType } from '~NoteView/types';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { Divider, MenuItem, Select, FormControl, InputLabel, CardContent, Button, Collapse, TextField, InputAdornment } from '@material-ui/core';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { isNumber } from 'util';

export const SelectedNoteInspectorComponent = () => {
  const selectedNoteId = useSelector((state: RootState) => state.selectNoteState.selectedNoteId);
  const bars = useSelector((state: RootState) => state.barState.bars);
  const bar = bars.find(bar => bar.notes.some(note => note.id === selectedNoteId));
  const selectedNote = bar?.notes.find(note => note.id === selectedNoteId);
  const [detailExpanded, setDetailExpanded] = React.useState(false);
  const [noteAppearBeforeBeatsInput, setNoteAppearBeforeBeatsInput] = React.useState(selectedNote?.appearBeforeBeats.toString() || '');

  React.useEffect(() => {
    setNoteAppearBeforeBeatsInput(selectedNote?.appearBeforeBeats.toString() || noteAppearBeforeBeatsInput);
  }, [selectedNote?.appearBeforeBeats])

  if (!selectedNote) {
    return null;
  }

  const changeNoteType = (noteType: NoteType) => {
    dispatch(BarAction.changeNoteType(selectedNote.id, noteType));
  };

  const changeNoteAppearBeforeBeats = (noteAppearBeforeBeats: number) => {
    dispatch(BarAction.changeNoteAppearBeforeBeats(selectedNote.id, noteAppearBeforeBeats))
  }

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
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => changeNoteType(event.target.value as NoteType)}
        >
          {dropdownItems}
        </Select>
        <TextField
          fullWidth
          label="Note Appear Before (beat)"
          type="number"
          value={noteAppearBeforeBeatsInput}
          onChange={event => setNoteAppearBeforeBeatsInput(event.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="start">
              <Button onClick={() => {
                const value = parseFloat(noteAppearBeforeBeatsInput);
                if (!isNumber(value)) {
                  return;
                }
                changeNoteAppearBeforeBeats(value);
              }}>변경</Button>
            </InputAdornment>,
          }}
        />
      </FormControl>
      <Divider />
      <Button
        onClick={() => {
          setDetailExpanded(isExpanded => !isExpanded);
        }}
      >{detailExpanded ? <ArrowDropDown /> : <ArrowRight />}Details</Button>
      <Collapse in={detailExpanded}>
        <pre>{JSON.stringify(selectedNote, null, 2)}</pre>
      </Collapse>
    </CardContent>
  );
}