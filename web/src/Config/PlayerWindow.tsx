import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { Slider, Button, CardContent, Grid, Switch, FormControlLabel, IconButton, Typography } from '@material-ui/core';
import { isArray } from 'util';
import Player from './Player';
import { VolumeUp, Pause, PlayArrow } from '@material-ui/icons';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import player from './Player';
import { convertBarBeatToSecond } from '~utils/bar';

function getTimeStringFromSeccond(second: number) {
  const minutes = (second / 60).toFixed(0);
  const seconds = (second % 60).toFixed(0);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlayerWindow() {
  const cursor = useSelector((state: RootState) => state.playerState.cursor);
  const isPlaying = useSelector((state: RootState) => state.playerState.isPlaying);
  const beats = useSelector((state: RootState) => state.barState.beats);
  const autoScroll = useSelector((state: RootState) => state.configState.autoScroll);

  const [volume, setVolume] = useState(0.5);
  const [fileName, setFileName] = useState('Select file');

  const duration = getTimeStringFromSeccond(convertBarBeatToSecond(beats));
  const currentTime = getTimeStringFromSeccond(convertBarBeatToSecond(cursor.beats));

  return (
    <CardContent>
      <Grid container alignItems={'center'}>
        <Grid item xs={12}>
          <Button
            onClick={() => {
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
                setFileName(file.name);
                player.setAudioSource(URL.createObjectURL(file));
              }
            }}
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
              onChange={(event, value) => {
                const beat = isArray(value) ? value[0] : value;
                Player.seek(beat);
              }}
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
              onChange={(event, checked) => dispatch(ConfigAction.setAutoScroll(checked))}
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
                onChange={(event, value) => {
                  const volume = isArray(value) ? value[0] : value;
                  Player.setVolume(volume);
                  setVolume(volume);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  );
}
