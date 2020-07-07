import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Slider, Grid, Button, TextField, InputAdornment, Select, MenuItem, InputLabel } from '@material-ui/core';
import { connect } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';
import { Close } from '@material-ui/icons';
import { isNumber } from 'util';
import { batchActions } from 'redux-batched-actions';
import { BarAction } from '~StateStore/_gen/bar_action.ts';
import { LongNoteAction } from '~StateStore/_gen/longNote_action.ts';
import storageManager from '~storageManager/storageManager';

function mapStateToPlayerWindowProps(state: RootState, props: AdvancedConfigDialogProps) {
  const {
    bpm,
    keys,
    guideBeat,
    beatHeight,
    defaultBarBeat,
    autoSaveDelay,
    defaultAppearBefore,
  } = state.configState;

  const {
    open,
    close,
  } = props;

  return {
    bpm,
    keys,
    guideBeat,
    beatHeight,
    defaultBarBeat,
    autoSaveDelay,
    defaultAppearBefore,
    open,
    close,
  };
}

export type AdvancedConfigDialogProps = {
  close: () => void;
  open: boolean;
}

export type AdvancedConfigDialogState = {
  bpmInput: string;
  keysInput: string;
  beatHeightInput: string;
  defaultBarBeatInput: string;
  autoSaveDelayInput: string;
  defaultAppearBeforeInput: string;
  storageServiceName: string;
  storageServiceList: string[];
};

class AdvancedConfigDialog extends Component<ReturnType<typeof mapStateToPlayerWindowProps>, AdvancedConfigDialogState>{
  constructor(props: ReturnType<typeof mapStateToPlayerWindowProps>) {
    super(props);

    const {
      bpm,
      keys,
      beatHeight,
      defaultBarBeat,
      autoSaveDelay,
      defaultAppearBefore,
    } = props;

    this.state = {
      bpmInput: bpm.toString(),
      keysInput: keys.toString(),
      beatHeightInput: beatHeight.toString(),
      defaultBarBeatInput: defaultBarBeat.toString(),
      autoSaveDelayInput: autoSaveDelay.toString(),
      defaultAppearBeforeInput: defaultAppearBefore.toString(),
      storageServiceName: storageManager.getStorageServiceName(),
      storageServiceList: storageManager.getStorageServiceList(),
    };

    this.setBpmInput = this.setBpmInput.bind(this);
    this.setKeysInput = this.setKeysInput.bind(this);
    this.setBeatHeightInput = this.setBeatHeightInput.bind(this);
    this.setDefaultBarBeatInput = this.setDefaultBarBeatInput.bind(this);
    this.setAutoSaveDelayInput = this.setAutoSaveDelayInput.bind(this);
    this.setDefaultAppearBeforeInput = this.setDefaultAppearBeforeInput.bind(this);
  }

  public componentWillReceiveProps(nextProps: Readonly<ReturnType<typeof mapStateToPlayerWindowProps>>) {
    const {
      bpm,
      keys,
      beatHeight,
      defaultBarBeat,
      defaultAppearBefore,
    } = nextProps;

    this.setState({
      bpmInput: bpm.toString(),
      keysInput: keys.toString(),
      beatHeightInput: beatHeight.toString(),
      defaultBarBeatInput: defaultBarBeat.toString(),
      defaultAppearBeforeInput: defaultAppearBefore.toString(),
    });
  }

  private setBpmInput(value: string) {
    this.setState({
      bpmInput: value,
    });
  }

  private setKeysInput(value: string) {
    this.setState({
      keysInput: value,
    });
  }

  private setBeatHeightInput(value: string) {
    this.setState({
      beatHeightInput: value,
    });
  }

  private setDefaultBarBeatInput(value: string) {
    this.setState({
      defaultBarBeatInput: value,
    });
  }

  private setAutoSaveDelayInput(value: string) {
    this.setState({
      autoSaveDelayInput: value,
    });
  }

  private setDefaultAppearBeforeInput(value: string) {
    this.setState({
      defaultAppearBeforeInput: value,
    });
  }

  public render() {
    const {
      close,
      open,
      guideBeat,
    } = this.props;

    const {
      bpmInput,
      keysInput,
      beatHeightInput,
      defaultBarBeatInput,
      autoSaveDelayInput,
      defaultAppearBeforeInput,
      storageServiceName,
      storageServiceList,
    } = this.state;

    const configMap: {
      name: string,
      value: string,
      setValue: (value: string) => void,
      apply: () => void;
    }[] = [
        {
          name: 'bpm',
          value: bpmInput,
          setValue: this.setBpmInput,
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
          setValue: this.setKeysInput,
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
          setValue: this.setBeatHeightInput,
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
          setValue: this.setDefaultBarBeatInput,
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
          setValue: this.setAutoSaveDelayInput,
          apply: () => {
            const value = parseFloat(bpmInput);
            if (!isNumber(value)) {
              return;
            }
            dispatch(ConfigAction.setAutoSaveDelay(value))
          },
        },
        {
          name: 'defaultAppearBefore (beat)',
          value: defaultAppearBeforeInput,
          setValue: this.setDefaultAppearBeforeInput,
          apply: () => {
            const value = parseFloat(defaultAppearBeforeInput);
            if (!isNumber(value)) {
              return;
            }
            dispatch(ConfigAction.setDefaultAppearBefore(value))
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
            onClick={() => { this.setState({ storageServiceList: storageManager.getStorageServiceList() }) }}
            fullWidth
            labelId="select-storage-service"
            value={storageServiceName}
            onChange={event => {
              const newStorageServiceName = event.target.value as string;
              const changed = storageManager.setStorageService(newStorageServiceName);
              if (changed) {
                this.setState({
                  storageServiceName: newStorageServiceName,
                })
              }
            }}
          >
            {storageServiceList.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
          </Select>
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect(mapStateToPlayerWindowProps)(AdvancedConfigDialog);
