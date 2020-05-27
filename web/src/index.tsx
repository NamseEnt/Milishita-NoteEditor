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

ReactDOM.render(
  (<Provider store={store}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
      <div><NoteView /></div>
      <div>
        <ConfigWindow />
        <InspectorWindow />
      </div>
    </div>
  </Provider>),
  document.getElementById('root'),
)
