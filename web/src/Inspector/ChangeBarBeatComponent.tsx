import React, { Component, ChangeEvent } from 'react';
import { Bar } from '~NoteView/types';
import { isNumber } from 'util';
import { dispatch } from '~StateStore/store';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { removeOverFlowedNotes } from '~utils/note';
import { Button, InputAdornment, TextField} from '@material-ui/core';

type ChangeBarBeatInputProps = {
  isPlaying: boolean;
  barIndex: number;
  bar: Bar;
}

type ChangeBarBeatInputStates = {
  inputText: string;
}

export default class ChangeBarBeatComponent extends Component<ChangeBarBeatInputProps, ChangeBarBeatInputStates>  {
  constructor(props: ChangeBarBeatInputProps) {
    super(props);
    this.state = {
      inputText: props.bar.beat.toString()
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<ChangeBarBeatInputProps>): void {
    this.setInputText(nextProps.bar.beat.toString());
  }

  private setInputText(inputText: string): void {
    this.setState({
      inputText,
    });
  }

  private changeBarBeat(): void {
    const { inputText } = this.state;
    const {
      bar,
      barIndex,
    } = this.props;

    const beat = parseFloat(inputText);
    if (!isNumber(beat)) {
      return;
    }

    if (bar.beat > beat) {
      removeOverFlowedNotes(beat, bar.id, barIndex);
    }

    dispatch(BarAction.changeBarBeat(barIndex, beat));
  }

  public render() {
    const { inputText } = this.state;
    const {
      barIndex,
      isPlaying,
    } = this.props;

    return <TextField
      fullWidth
      label={`${barIndex}번 마디의 박자`}
      disabled={isPlaying}
      type={'number'}
      value={inputText}
      onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => this.setInputText(event.target.value)}
      InputProps={{
        endAdornment: <InputAdornment position="start">
          <Button onClick={() => { this.changeBarBeat() }}>변경</Button>
        </InputAdornment>,
      }}
    />
  }
}