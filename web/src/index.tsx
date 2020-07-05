import React from 'react'
import ReactDOM from 'react-dom'
import { InspectorWindow } from '~Inspector/InspectorWindow'
import NoteView from '~NoteView/NoteView'
import { Provider } from 'react-redux'
import { store } from '~StateStore/store'
import { ConfigWindow } from '~Config/ConfigWindow'
import '~/test.ts';
import '~/keyboardHandler';
import { Container, Grid } from '@material-ui/core'
import handleKeyDown from '~/keyboardHandler'

ReactDOM.render(
  (<Provider store={store}>
    <Container>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <NoteView />
        </Grid>
        <Grid item md={6} xs={12}>
          <ConfigWindow />
          <InspectorWindow />
        </Grid>
      </Grid>
    </Container>
  </Provider>),
  document.getElementById('root'),
  () => document.onkeydown = handleKeyDown,
)
