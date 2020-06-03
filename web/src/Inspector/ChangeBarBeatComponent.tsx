import React, { Component, ChangeEvent } from 'react';
import { Bar } from '~NoteView/types';
import { isNumber } from 'util';
import { dispatch } from '~StateStore/store';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { removeOverFlowedNotes } from '~utils/note';
import { Button, InputAdornment, TextField, InputLabel, Select, MenuItem} from '@material-ui/core';
import { convertBarSecondToBeat, convertBarBeatToSecond } from '~utils/bar';

const durationUnits = ['second', 'beat'] as const;
type DurationUnit = typeof durationUnits[number];

type ChangeBarBeatInputProps = {
  isPlaying: boolean;
  barIndex: number;
  bar: Bar;
}

type ChangeBarBeatInputStates = {
  inputText: string;
  durationUnit: DurationUnit;
}

export default class ChangeBarBeatComponent extends Component<ChangeBarBeatInputProps, ChangeBarBeatInputStates>  {
  constructor(props: ChangeBarBeatInputProps) {
    super(props);
    this.state = {
      inputText: this.getDurationByBeat(props.bar.beat, 'beat').toString(),
      durationUnit: 'beat',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDurationUnitSelectChange = this.handleDurationUnitSelectChange.bind(this);
  }

  public componentWillReceiveProps(nextProps: Readonly<ChangeBarBeatInputProps>): void {
    const duration = this.getDurationByBeat(nextProps.bar.beat);
    this.setState({
      inputText: duration.toString(),
    });
  }

  private getDurationByBeat(beat: number, manualDurationUnit?: DurationUnit) {
    const durationUnit = manualDurationUnit || this.state.durationUnit;
    return durationUnit === 'second'
      ? convertBarBeatToSecond(beat)
      : beat;
  }

  private handleInputChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    this.setState({
      inputText: event.target.value,
    });
  }

  private handleDurationUnitSelectChange(event: React.ChangeEvent<{ value: unknown }>): void {
    const { beat } = this.props.bar;
    const durationUnit = event.target.value as DurationUnit;
    const duration = this.getDurationByBeat(beat, durationUnit);

    this.setState({
      durationUnit,
      inputText: duration.toString(),
    });
  }

  private changeBarBeat(): void {
    const {
      inputText,
      durationUnit,
    } = this.state;
    const {
      bar,
      barIndex,
    } = this.props;

    const inputNumber = parseFloat(inputText);
    if (!isNumber(inputNumber)) {
      return;
    }

    const beat = durationUnit === 'second'
      ? convertBarSecondToBeat(inputNumber)
      : inputNumber;

    if (bar.beat > beat) {
      removeOverFlowedNotes(beat, bar.id, barIndex);
    }

    dispatch(BarAction.changeBarBeat(barIndex, beat));
  }

  public render() {
    const {
      inputText,
      durationUnit,
    } = this.state;
    const {
      barIndex,
      isPlaying,
    } = this.props;

    const durationUnitItems = durationUnits.map(unit => <MenuItem
      key={`selected-note-${unit}`}
      value={unit}
      disabled={durationUnit === unit}
      selected={durationUnit === unit}
    >{unit}</MenuItem>);

    return <TextField
      fullWidth
      label={`${barIndex}번 마디의 길이`}
      disabled={isPlaying}
      type={'number'}
      value={inputText}
      onChange={this.handleInputChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">
          <Select
            label={<InputLabel >Note Type</InputLabel>}
            value={durationUnit}
            onChange={this.handleDurationUnitSelectChange}
          >{durationUnitItems}</Select>
        </InputAdornment>,
        endAdornment: <InputAdornment position="start">
          <Button onClick={() => { this.changeBarBeat() }}>변경</Button>
        </InputAdornment>,
      }}
    />
  }
}