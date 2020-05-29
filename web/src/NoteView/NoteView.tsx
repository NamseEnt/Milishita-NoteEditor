import React from 'react';
import { Segment, Header } from "semantic-ui-react";
import NoteViewCanvas from './NoteViewCanvas';

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
      <Segment.Group>
        <Segment><Header>NoteView</Header></Segment>
        <Segment textAlign={'center'}>
          <canvas width={440} height={500} ref={this.setCanvasRef} />
        </Segment>
      </Segment.Group>
    );
  }
}
