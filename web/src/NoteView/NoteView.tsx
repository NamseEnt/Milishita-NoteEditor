import React from 'react';
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
      <div>
        <h1>NoteView</h1>
        <canvas width={440} height={500} ref={this.setCanvasRef} />
      </div>
    );
  }
}
