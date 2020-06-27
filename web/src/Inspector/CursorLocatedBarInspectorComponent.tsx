import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, store, dispatch } from '~StateStore/store';
import { getBarIndexByBeats } from '~utils/bar';
import { LongNoteAction } from '~StateStore/_gen/longNote_action.ts';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import ChangeBarBeatComponent from './ChangeBarBeatComponent';
import {ButtonGroup, Button, Container, CardContent, Collapse } from '@material-ui/core';
import { batchActions } from 'redux-batched-actions';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';

export const CursorLocatedBarInspectorComponent = () => {
  const isPlaying = useSelector((state: RootState) => state.playerState.isPlaying);
  const bars = useSelector((state: RootState) => state.barState.bars);
  const beats = useSelector((state: RootState) => state.playerState.cursor.beats);
  const [detailExpanded, setDetailExpanded] = React.useState(false);
  const barIndex = getBarIndexByBeats(beats);
  if (barIndex < 0) {
    return null;
  }

  const bar = bars.get(barIndex);
  if (!bar) {
    return null;
  }

  const removeBar = () => {
    dispatch(batchActions([
      LongNoteAction.removeLongNotesOnBar(bar.id),
      BarAction.removeNotesOnBar(barIndex),
      BarAction.removeBar(barIndex),
    ]));
  }

  const insertBar = () => {
    dispatch(BarAction.insertNewBar(barIndex, store.getState().configState.defaultBarBeat));
  }

  const Buttons = () => <ButtonGroup
    fullWidth
  >
    <Button
      disabled={isPlaying}
      onClick={() => { insertBar() }}
      variant='contained'
      color='primary'
    >{`${barIndex}번 마디 아래에 한 마디 추가`}</Button>
    <Button
      disabled={isPlaying}
      onClick={removeBar}
      variant='contained'
      color='secondary'
    >{`${barIndex}번 마디 삭제`}</Button>
  </ButtonGroup>

  return (
    <Container disableGutters>
      <CardContent>
        <Buttons />
      </CardContent>
      <CardContent>
        <ChangeBarBeatComponent
          bar={bar}
          barIndex={barIndex}
          isPlaying={isPlaying}
        />
      </CardContent>
      <CardContent>
        <Button
          onClick={() => {
            setDetailExpanded(isExpanded => !isExpanded);
          }}
        >{detailExpanded ? <ArrowDropDown /> : <ArrowRight />}Details</Button>
        <Collapse in={detailExpanded}>
          <pre>{JSON.stringify(bar, null, 2)}</pre>
        </Collapse>
      </CardContent>
    </Container>
  );
}