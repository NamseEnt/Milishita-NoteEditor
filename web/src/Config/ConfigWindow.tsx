import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { ModeWindow } from './ModeWindow';
import { Typography, Card, CardContent, Button, Grid } from '@material-ui/core';
import PlayerWindow from './PlayerWindow';
import { Settings } from '@material-ui/icons';
import AdvancedConfigDialog from './AdvancedConfigDialog';

export const ConfigWindow = () => {
  const mode = useSelector((state: RootState) => state.modeState.mode);
  const noteTypeMode = useSelector((state: RootState) => state.modeState.noteTypeMode);
  const [advancedConfigOpen, setAdvancedConfigOpen] = React.useState(false);

  return (
    <Card>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h3">Config</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={() => setAdvancedConfigOpen(true)}
            ><Settings fontSize="large" /></Button>
            <AdvancedConfigDialog open={advancedConfigOpen} close={() => setAdvancedConfigOpen(false)} />
          </Grid>
        </Grid>
      </CardContent>
      <PlayerWindow />
      <ModeWindow mode={mode} noteTypeMode={noteTypeMode} />
    </Card>
  );
}