import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { Slider, Button, CardContent, Grid, Switch, FormControlLabel } from '@material-ui/core';
import { isArray } from 'util';
import Player from './Player';
import { VolumeUp, Pause, PlayArrow } from '@material-ui/icons';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import player from './Player';

type PlayerWindowProps = ReturnType<typeof mapStateToPlayerWindowProps>

type PlayerWindowState = {
  volume: number;
  fileName: string;
}

function mapStateToPlayerWindowProps(state: RootState) {
  const {
    isPlaying,
    cursor,
  } = state.playerState;

  const {
    beats,
  } = state.barState;

  const {
    autoScroll,
  } = state.configState;

  return {
    isPlaying,
    cursor,
    beats,
    autoScroll,
  };
}

class UnconnectedPlayerWindow extends Component<PlayerWindowProps, PlayerWindowState> {
  constructor(props: PlayerWindowProps) {
    super(props);

    const {
      beats,
    } = props;

    this.state = {
      volume: 0.5,
      fileName: 'Select file',
    };

    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleFileButtonClick = this.handleFileButtonClick.bind(this);
  }

  private handleVolumeChange(event: React.ChangeEvent<{}>, value: number | number[]) {
    const volume = isArray(value) ? value[0] : value;
    Player.setVolume(volume);
    this.setState({
      volume,
    });
  }

  private handleTimebarChange(event: React.ChangeEvent<{}>, value: number | number[]) {
    const beat = isArray(value) ? value[0] : value;
    Player.seek(beat);
  }

  private handleAutoScrollChange(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    dispatch(ConfigAction.setAutoScroll(checked));
  }

  private handleFileButtonClick() {
    const inputElement = document.createElement('input');
    inputElement.style.display = 'none';
    inputElement.type = 'file';
    inputElement.click();
    inputElement.onchange = event => {
      const target = event.target as HTMLInputElement;
      if (!target) {
        return;
      }
      const file = target.files ? target.files[0] : null;
      if (!file) {
        return;
      }
      this.setState({ fileName: file.name });
      player.setAudioSource(URL.createObjectURL(file));
    }
  }

  public render() {
    const {
      volume,
      fileName,
    } = this.state;

    const {
      cursor,
      isPlaying,
      beats,
      autoScroll,
    } = this.props;

    return (
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Slider
              min={0}
              max={beats}
              step={0.001}
              value={cursor.beats}
              valueLabelDisplay={'on'}
              valueLabelFormat={beats => beats.toFixed(1)}
              marks={[
                { value: beats, label: beats.toFixed(1) },
              ]}
              onChange={this.handleTimebarChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={Player.togglePlay} style={{paddingTop: '0px', paddingBottom: '0px'}}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </Button>
          </Grid>
          <Grid item xs={1}><VolumeUp /></Grid>
          <Grid item xs={9}>
            <Slider
              min={0}
              max={1}
              step={0.001}
              value={volume}
              onChange={this.handleVolumeChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Switch
                color="primary"
                checked={autoScroll}
                onChange={this.handleAutoScrollChange}
              />}
              label="Auto Scroll"
              labelPlacement="start"
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={this.handleFileButtonClick}
              variant="contained"
            >{fileName}</Button>
          </Grid>
        </Grid>
      </CardContent>
    );
  }
}

const PlayerWindow = connect(mapStateToPlayerWindowProps)(UnconnectedPlayerWindow);

export default PlayerWindow;
