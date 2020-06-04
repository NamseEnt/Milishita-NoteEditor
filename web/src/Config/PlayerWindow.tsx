import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '~StateStore/store';
import { Slider, Button, CardContent, Grid, Select, Switch, FormControlLabel } from '@material-ui/core';
import { isArray } from 'util';
import Player from './Player';
import { VolumeUp, Pause, PlayArrow } from '@material-ui/icons';

type PlayerWindowProps = ReturnType<typeof mapStateToPlayerWindowProps>

type PlayerWindowState = {
  volume: number;
}

function mapStateToPlayerWindowProps(state: RootState) {
  const {
    isPlaying,
    cursor,
  } = state.playerState;

  const {
    beats,
  } = state.barState;

  return {
    isPlaying,
    cursor,
    beats,
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
    };

    this.handleVolumeChange = this.handleVolumeChange.bind(this);
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

  public render() {
    const {
      volume,
    } = this.state;

    const {
      cursor,
      isPlaying,
      beats,
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
        </Grid>
      </CardContent>
    );
  }
}

const PlayerWindow = connect(mapStateToPlayerWindowProps)(UnconnectedPlayerWindow);

export default PlayerWindow;
