import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

import { SelectedNoteInspectorComponent } from './SelectedNoteInspectorComponent';
import { CursorLocatedBarInspectorComponent } from './CursorLocatedBarInspectorComponent';

export const InspectorWindow = () => {
  return (
    <Segment.Group>
      <Segment><Header>Inspector</Header></Segment>
      <SelectedNoteInspectorComponent />
      <CursorLocatedBarInspectorComponent />
    </Segment.Group>
  );
}