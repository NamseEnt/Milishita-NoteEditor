import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, store, dispatch } from '~StateStore/store';
import { getBarIndexByBeats } from '~utils/bar';
import { LongNoteAction } from '~StateStore/_gen/longNote_action.ts';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { Button, Label, Segment, Divider } from 'semantic-ui-react';
import ChangeBarBeatComponent from './ChangeBarBeatComponent';

export const CursorLocatedBarInspectorComponent = () => {
  const isPlaying = useSelector((state: RootState) => state.playerState.isPlaying);
  const beats = store.getState().playerState.cursor.beats
  const barIndex = getBarIndexByBeats(beats);
  if (barIndex < 0) {
    return null;
  }

  const bar = store.getState().barState.bars.get(barIndex);
  if (!bar) {
    return null;
  }

  const removeBar = () => {
    dispatch(LongNoteAction.removeLongNotesOnBar(bar.id));
    dispatch(BarAction.removeNotesOnBar(barIndex));
    dispatch(BarAction.removeBar(barIndex));
  }

  const insertBar = () => dispatch(BarAction.insertNewBar(barIndex, store.getState().configState.defaultBarBeat));

  const Buttons = () => <Button.Group fluid>
    <Button as={'div'} labelPosition={'left'}>
      <Label size={'medium'}>{`${barIndex}번 마디`}</Label>
      <Button
        size={'medium'}
        disabled={isPlaying}
        onClick={() => { insertBar() }}
      >아래에 한 마디 추가</Button>
      <Button
        disabled={isPlaying}
        onClick={() => { removeBar() }}
      >삭제</Button>
    </Button>
  </Button.Group>

  return (
    <Segment>
      <Buttons />
      <Divider />
      <ChangeBarBeatComponent
        bar={bar}
        barIndex={barIndex}
        isPlaying={isPlaying}
      />
      <Divider />
      {JSON.stringify(bar, null, 2)}
    </Segment>
  );
}