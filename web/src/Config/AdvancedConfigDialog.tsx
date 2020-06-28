import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Slider, Grid, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import { Close } from '@material-ui/icons';

export type AdvancedConfigDialogProps = {
  close: () => void;
  open: boolean;
}

export default function AdvancedConfigDialog(props: AdvancedConfigDialogProps) {
  const {
    close,
    open,
  } = props;

  const guideBeat = useSelector((state: RootState) => state.configState.guideBeat);

  return (
    <Dialog onClose={close} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h4">Advanced Config</Typography>
          </Grid>
          <Grid item>
            <Button variant="text" onClick={close}><Close fontSize="large" /></Button>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  );
}
