import React from 'react';
import { SelectedNoteInspectorComponent } from './SelectedNoteInspectorComponent';
import { CursorLocatedBarInspectorComponent } from './CursorLocatedBarInspectorComponent';
import { Card, Typography, List, ListItem } from '@material-ui/core';

export const InspectorWindow = () => {
  return (
    <Card style={{marginTop: '16px'}}>
      <List>
        <ListItem>
          <Typography variant="h3">Inspector</Typography>
        </ListItem>
        <ListItem>
          <SelectedNoteInspectorComponent />
        </ListItem>
        <ListItem>
          <CursorLocatedBarInspectorComponent />
        </ListItem>
      </List>
    </Card>
  );
}