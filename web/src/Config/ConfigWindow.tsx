import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { ModeWindow } from './ModeWindow';
import { Slider, Typography, Card, CardContent } from '@material-ui/core';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import PlayerWindow from './PlayerWindow';

export const ConfigWindow = () => {
  const mode = useSelector((state: RootState) => state.modeState.mode);
  const noteTypeMode = useSelector((state: RootState) => state.modeState.noteTypeMode);
  const guideBeat = useSelector((state: RootState) => state.configState.guideBeat);

  return (
    <Card>
      <CardContent><Typography variant="h3">Config</Typography></CardContent>
      <PlayerWindow />
      <CardContent>
        <Typography gutterBottom>Guide Beat</Typography>
        <Slider
          value={Math.log2(guideBeat)}
          min={-4}
          step={1}
          max={1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => value < 0 ? `1 / ${2 ** -value}` : value}
          onChange={(_, value) => dispatch(ConfigAction.setGuideBeat(2 ** (value as number)))}
        />
      </CardContent>
      <ModeWindow mode={mode} noteTypeMode={noteTypeMode} />
    </Card>
  );
}