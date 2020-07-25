import React, { ChangeEvent, useState, useEffect } from 'react';
import { Bar } from '~NoteView/types';
import { isNumber } from 'util';
import { dispatch } from '~StateStore/store';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { Button, InputAdornment, TextField, InputLabel, Select, MenuItem } from '@material-ui/core';
import { convertBarSecondToBeat, convertBarBeatToSecond } from '~utils/bar';
import { batchActions } from 'redux-batched-actions';
import { LongNoteAction } from '~StateStore/_gen/longNote_action.ts';

const durationUnits = ['second', 'beat'] as const;
type DurationUnit = typeof durationUnits[number];

type ChangeBarBeatInputProps = {
  isPlaying: boolean;
  barIndex: number;
  bar: Bar;
}

export default function ChangeBarBeatComponent(props: ChangeBarBeatInputProps) {
  const {
    bar,
    barIndex,
    isPlaying,
  } = props;

  const [durationInput, setDurationInput] = useState('');
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('beat');

  useEffect(() => {
    const { beat } = bar;
    const duration = durationUnit === 'second'
      ? convertBarBeatToSecond(beat)
      : beat;
    setDurationInput(duration.toString());
  }, [bar.beat, durationUnit]);

  const durationUnitItems = durationUnits.map(unit => <MenuItem
    key={`select-duration-unit-${unit}`}
    value={unit}
    disabled={durationUnit === unit}
    selected={durationUnit === unit}
  >{unit}</MenuItem>);

  return (
    <TextField
      fullWidth
      label={`${barIndex}번 마디의 길이`}
      disabled={isPlaying}
      type={'number'}
      value={durationInput}
      onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDurationInput(event.target.value)}
      InputProps={{
        startAdornment: <InputAdornment position="start">
          <Select
            label={<InputLabel >Note Type</InputLabel>}
            value={durationUnit}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => setDurationUnit(event.target.value as DurationUnit)}
          >{durationUnitItems}</Select>
        </InputAdornment>,
        endAdornment: <InputAdornment position="start">
          <Button onClick={() => {
            const duration = parseFloat(durationInput);
            if (!isNumber(duration)) {
              return;
            }

            const beat = durationUnit === 'second'
              ? convertBarSecondToBeat(duration)
              : duration;

            if (bar.beat > beat) {
              dispatch(batchActions([
                LongNoteAction.removeOverflowedLongNotes(bar.id, beat),
                BarAction.removeOverflowedNotes(barIndex, beat),
                BarAction.changeBarBeat(barIndex, beat),
              ]));
              return;
            }

            dispatch(BarAction.changeBarBeat(barIndex, beat));
          }}>변경</Button>
        </InputAdornment>,
      }}
    />
  );
}
