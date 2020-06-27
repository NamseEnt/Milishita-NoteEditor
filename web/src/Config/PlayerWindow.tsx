import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { Slider, Button, CardContent, Grid, Switch, FormControlLabel, IconButton, Typography } from '@material-ui/core';
import { isArray } from 'util';
import Player from './Player';
import { VolumeUp, Pause, PlayArrow } from '@material-ui/icons';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import player from './Player';
import { convertBarBeatToSecond } from '~utils/bar';

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

function getTimeStringFromSeccond(second: number) {
  const minutes = (second / 60).toFixed(0);
  const seconds = (second % 60).toFixed(0);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

class UnconnectedPlayerWindow extends Component<PlayerWindowProps, PlayerWindowState> {
  constructor(props: PlayerWindowProps) {
    super(props);

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

    const duration = getTimeStringFromSeccond(convertBarBeatToSecond(beats));
    const currentTime = getTimeStringFromSeccond(convertBarBeatToSecond(cursor.beats));

    return (
      <CardContent>
        <Grid container alignItems={'center'}>
          <Grid item xs={12}>
            <Button
              onClick={this.handleFileButtonClick}
              variant="contained"
              color='primary'
              fullWidth
            >{fileName}</Button>
          </Grid>
          <Grid container spacing={1} alignItems={'center'}>
            <Grid item>
              <IconButton onClick={Player.togglePlay}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Grid>
            <Grid item>
              <Typography>
                {currentTime}
              </Typography>
            </Grid>
            <Grid item xs>
              <Slider
                min={0}
                max={beats}
                step={0.001}
                value={cursor.beats}
                onChange={this.handleTimebarChange}
              />
            </Grid>
            <Grid item>
              <Typography>
                {duration}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs>
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
          <Grid item xs={4}>
            <Grid container alignItems={'center'}>
              <Grid item>
                <IconButton>
                  <VolumeUp />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Slider
                  min={0}
                  max={1}
                  step={0.001}
                  value={volume}
                  onChange={this.handleVolumeChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    );
  }
}

const PlayerWindow = connect(mapStateToPlayerWindowProps)(UnconnectedPlayerWindow);

export default PlayerWindow;
