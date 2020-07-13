import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Slider, Grid, Button, TextField, InputAdornment, Select, MenuItem, InputLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import { Close } from '@material-ui/icons';
import { isNumber } from 'util';
import { batchActions } from 'redux-batched-actions';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { LongNoteAction } from '~StateStore/_gen/longNote_action.ts';
import storageManager from '~storageManager/storageManager';

export type AdvancedConfigDialogProps = {
  close: () => void;
  open: boolean;
}

export default function AdvancedConfigDialog(props: AdvancedConfigDialogProps) {
  const bpm = useSelector((state: RootState) => state.configState.bpm);
  const keys = useSelector((state: RootState) => state.configState.keys);
  const beatHeight = useSelector((state: RootState) => state.configState.beatHeight);
  const defaultBarBeat = useSelector((state: RootState) => state.configState.defaultBarBeat);
  const autoSaveDelay = useSelector((state: RootState) => state.configState.autoSaveDelay);
  const defaultAppearBeforeBeats = useSelector((state: RootState) => state.configState.defaultAppearBeforeBeats);

  const guideBeat = useSelector((state: RootState) => state.configState.guideBeat);

  const [bpmInput, setBpmInput] = useState(bpm.toString());
  const [keysInput, setKeysInput] = useState(keys.toString());
  const [beatHeightInput, setBeatHeightInput] = useState(beatHeight.toString());
  const [defaultBarBeatInput, setDefaultBarBeatInput] = useState(defaultBarBeat.toString());
  const [autoSaveDelayInput, setAutoSaveDelayInput] = useState(autoSaveDelay.toString());
  const [defaultAppearBeforeBeatsInput, setDefaultAppearBeforeBeatsInput] = useState(defaultAppearBeforeBeats.toString());

  const [storageServiceName, setStorageServiceName] = useState(storageManager.getStorageServiceName());
  const [storageServiceList, setStorageServiceList] = useState(storageManager.getStorageServiceList());

  useEffect(() => setBpmInput(bpm.toString()), [bpm])
  useEffect(() => setKeysInput(keys.toString()), [keys])
  useEffect(() => setBeatHeightInput(beatHeight.toString()), [beatHeight])
  useEffect(() => setDefaultBarBeatInput(defaultBarBeat.toString()), [defaultBarBeat])
  useEffect(() => setDefaultAppearBeforeBeatsInput(defaultAppearBeforeBeats.toString()), [defaultAppearBeforeBeats])

  const {
    close,
    open,
  } = props;

  const configMap: {
    name: string,
    value: string,
    setValue: (value: string) => void,
    apply: () => void;
  }[] = [
      {
        name: 'bpm',
        value: bpmInput,
        setValue: setBpmInput,
        apply: () => {
          const value = parseFloat(bpmInput);
          if (!isNumber(value)) {
            return;
          }
          dispatch(ConfigAction.setBpm(value))
        },
      },
      {
        name: 'keys',
        value: keysInput,
        setValue: setKeysInput,
        apply: () => {
          const value = parseFloat(keysInput);
          if (!isNumber(value)) {
            return;
          }

          const keys = Math.floor(value);

          dispatch(batchActions([
            ConfigAction.setKeys(keys),
            BarAction.removeNotesOutOfKeys(keys),
            LongNoteAction.removeLongNotesOutOfKeys(keys),
          ]));
        },
      },
      {
        name: 'beatHeight',
        value: beatHeightInput,
        setValue: setBeatHeightInput,
        apply: () => {
          const value = parseFloat(beatHeightInput);
          if (!isNumber(value)) {
            return;
          }
          dispatch(ConfigAction.setBeatHeight(value))
        },
      },
      {
        name: 'defaultBarBeat',
        value: defaultBarBeatInput,
        setValue: setDefaultBarBeatInput,
        apply: () => {
          const value = parseFloat(defaultBarBeatInput);
          if (!isNumber(value)) {
            return;
          }
          dispatch(ConfigAction.setDefaultBarBeat(value))
        },
      },
      {
        name: 'autoSaveDelay',
        value: autoSaveDelayInput,
        setValue: setAutoSaveDelayInput,
        apply: () => {
          const value = parseFloat(bpmInput);
          if (!isNumber(value)) {
            return;
          }
          dispatch(ConfigAction.setAutoSaveDelay(value))
        },
      },
      {
        name: 'defaultAppearBeforeBeat (beat)',
        value: defaultAppearBeforeBeatsInput,
        setValue: setDefaultAppearBeforeBeatsInput,
        apply: () => {
          const value = parseFloat(defaultAppearBeforeBeatsInput);
          if (!isNumber(value)) {
            return;
          }
          dispatch(ConfigAction.setDefaultAppearBeforeBeats(value))
        },
      },
  ];

  return (
    <Dialog
      onClose={close}
      open={open}
    >
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
      {configMap.map(config =>
        <DialogContent key={config.name}>
          <TextField
            fullWidth
            label={config.name}
            type="number"
            value={config.value}
            onChange={event => config.setValue(event.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="start">
                <Button onClick={config.apply}>변경</Button>
              </InputAdornment>,
            }}
          />
        </DialogContent>
      )}
      <DialogContent>
        <InputLabel shrink id="select-storage-service">Storage Service</InputLabel>
        <Select
          onClick={() => setStorageServiceList(storageManager.getStorageServiceList())}
          fullWidth
          labelId="select-storage-service"
          value={storageServiceName}
          onChange={event => {
            const newStorageServiceName = event.target.value as string;
            const changed = storageManager.setStorageService(newStorageServiceName);
            if (changed) {
              setStorageServiceName(newStorageServiceName);
            }
          }}
        >
          {storageServiceList.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
        </Select>
      </DialogContent>
    </Dialog>
  );
}
