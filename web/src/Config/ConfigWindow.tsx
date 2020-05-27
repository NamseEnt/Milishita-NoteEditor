import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { ModeWindow } from './ModeWindow';
import { Slider, Typography, Button } from '@material-ui/core';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import { PlayerAction } from '~StateStore/_gen/player_action.ts';
const dearUrl = require('../dear.mp3');
console.log(dearUrl);
const audioElement = document.createElement('audio');
audioElement.src = dearUrl;

export const ConfigWindow = () => {
  const { mode, guideBeat, isPlaying, cursor } = useSelector((state: RootState) => {
    const { mode } = state.modeState;
    const { guideBeat } = state.configState;
    const { isPlaying, cursor } = state.playerState;
    return {
      mode,
      guideBeat,
      isPlaying,
      cursor,
    };
  });

  if (isPlaying && audioElement.paused) {
    audioElement.play();
  } else if (!isPlaying && !audioElement.paused) {
    audioElement.pause();
  }

  return (
    <div>
      <h1>Config</h1>
      <div>
        <Typography gutterBottom>
          Guide Beat
        </Typography>
        <Slider
          value={Math.log2(guideBeat)}
          min={-4}
          step={1}
          max={1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => value < 0 ? `1 / ${2 ** -value}` : value}
          onChange={(_, value) => dispatch(ConfigAction.setGuideBeat(2 ** (value as number)))}
        />
        <Button onClick={() => {dispatch(isPlaying ? PlayerAction.stop() : PlayerAction.play()) }}>
          {isPlaying ? '⏸ Stop' : '▶️ Play'} {cursor.beats.toFixed(1)}
        </Button>
      </div>
      <ModeWindow mode={mode} />
    </div>
  );
}