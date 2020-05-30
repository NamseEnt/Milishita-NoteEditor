import { ModeSelectHandler } from "./ModeSelectHandler";
import { modes, Mode, NoteType, noteTypes } from "~NoteView/types";
import React from "react";
import { dispatch } from "~StateStore/store";
import { ModeAction } from "~StateStore/_gen/mode_action.ts";
import { Button, ButtonGroup, Container, CardContent } from "@material-ui/core";

const modeSelectHandler = new ModeSelectHandler();

export const ModeWindow = (props: {
  mode: Mode,
  noteTypeMode: NoteType,
}) => {
  const { mode: currentMode } = props;
  const buttons = modes.map(mode => {
    return <Button
      key={`mode-change-button-${mode}`}
      onClick={() => {
        if (currentMode === mode) {
          return;
        }
        dispatch(ModeAction.changeMode(mode));
      }}
      variant={currentMode === mode ? 'contained' : 'outlined'}
    > {mode}</Button >;
  });

  const { noteTypeMode: currentNoteTypeMode } = props;
  const noteTypeButtons = noteTypes.map(noteTypeMode => {
    return <Button
      key={`single-note-mode-change-button-${noteTypeMode}`}
      onClick={() => {
        if (currentNoteTypeMode === noteTypeMode) {
          return;
        }
        dispatch(ModeAction.changeNoteTypeMode(noteTypeMode));
      }}
      variant={currentNoteTypeMode === noteTypeMode ? 'contained' : 'outlined'}
    > {noteTypeMode}</Button>

  });


  return (
    <Container disableGutters>
      <CardContent>
        <ButtonGroup fullWidth>
          {buttons}
        </ButtonGroup>
      </CardContent>
      <CardContent>
        <ButtonGroup fullWidth>
          {noteTypeButtons}
        </ButtonGroup>
      </CardContent>
    </Container>
  );
}