import React from 'react';
import { Button, Segment } from "semantic-ui-react";
import NoteViewCanvas from './NoteViewCanvas';
import { store, RootState, dispatch } from '~StateStore/store';
import { getBarIndexByBeats, getBarIndex } from '~utils/bar';
import { useSelector } from 'react-redux';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { LongNoteAction } from '~StateStore/_gen/longNote_action.ts';

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

  private removeBar(barIndex: number) {
    const bar = store.getState().barState.bars.get(barIndex);
    if (!bar) {
      return;
    }
    dispatch(LongNoteAction.removeLongNotesOnBar(bar.id));
    dispatch(BarAction.removeNotesOnBar(barIndex));
    dispatch(BarAction.removeBar(barIndex));
  }

  render() {
    const Buttons = () => {
      const isPlaying = useSelector((state: RootState) => state.playerState.isPlaying);
      const beats = store.getState().playerState.cursor.beats
      const barIndex = getBarIndexByBeats(beats);
      return <Button.Group>
        <Button
          disabled={isPlaying}
          onClick={() => {
            if (barIndex < 0) {
              return;
            }
            dispatch(BarAction.insertNewBar(barIndex))
          }}
        >{`${barIndex}번 마디 아래에 한 마디 추가`}</Button>
        <Button
          disabled={isPlaying}
          onClick={() => {
            if (barIndex < 0) {
              return;
            }
            this.removeBar(barIndex);
          }}
        >{`${barIndex}번 마디 삭제`}</Button>
      </Button.Group>
    }

    return (
      <Segment.Group>
          <h1>NoteView</h1>
        <Segment attached={'top'} textAlign={'center'}>
          <Buttons />
        </Segment>
        <Segment attached={'bottom'} textAlign={'center'}>
          <canvas width={440} height={500} ref={this.setCanvasRef} />
        </Segment>
      </Segment.Group>
    );
  }
}
