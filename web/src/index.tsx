import 'semantic-ui-css/semantic.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { InspectorWindow } from '~Inspector/InspectorWindow'
import NoteView from '~NoteView/NoteView'
import { Provider } from 'react-redux'
import { store } from '~StateStore/store'
import { ConfigWindow } from '~Config/ConfigWindow'
import '~/test.ts';
import '~/keyboardHandler';
import { Grid, Container } from 'semantic-ui-react'

ReactDOM.render(
  (<Provider store={store}>
    <Container>
      <Grid columns={2} doubling stackable>
        <Grid.Column>
          <NoteView />
        </Grid.Column>
        <Grid.Column>
          <ConfigWindow />
          <InspectorWindow />
        </Grid.Column>
      </Grid>
    </Container>
  </Provider>),
  document.getElementById('root'),
)
