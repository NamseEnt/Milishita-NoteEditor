import React from 'react';
import NoteViewCanvas from './NoteViewCanvas';
import { Card, Typography, CardContent } from '@material-ui/core';

type NoteViewProps = {

};

type NoteViewState = {

};

export default class NoteView extends React.Component<NoteViewProps, NoteViewState> {
  private noteViewCanvas?: NoteViewCanvas;

  constructor(props: NoteViewProps) {
    super(props);

    this.setCanvasRef = this.setCanvasRef.bind(this);
  }

  componentWillUnmount() {
    this.noteViewCanvas?.destory();
  }

  private setCanvasRef(element: HTMLCanvasElement) {
    this.noteViewCanvas = new NoteViewCanvas(element);
  }

  render() {
    return (
      <Card>
        <CardContent>
          <Typography variant="h3">NoteView</Typography>
        </CardContent>
        <CardContent>
          <canvas width={440} height={500} ref={this.setCanvasRef} />
        </CardContent>
      </Card>
    );
  }
}
