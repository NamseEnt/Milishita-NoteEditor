import React from 'react';
import { SelectedNoteInspectorComponent } from './SelectedNoteInspectorComponent';
import { CursorLocatedBarInspectorComponent } from './CursorLocatedBarInspectorComponent';
import { Card, Typography, CardContent } from '@material-ui/core';

export const InspectorWindow = () => {
  return (
    <Card style={{marginTop: '16px'}}>
      <CardContent><Typography variant="h3">Inspector</Typography></CardContent>
      <SelectedNoteInspectorComponent />
      <CursorLocatedBarInspectorComponent />
    </Card>
  );
}