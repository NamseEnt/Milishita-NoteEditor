import React from 'react';
import { CardContent, Grid, ButtonGroup, Button, Dialog, Typography, DialogActions, DialogContent, FormControlLabel, Switch } from '@material-ui/core';
import { Save, OpenInBrowser, Delete, SaveAlt } from '@material-ui/icons';
import StorageBrowser from './StorageBrowser';
import storageManager from '~storageManager/storageManager';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '~StateStore/store';
import { ConfigAction } from '~StateStore/_gen/config_action.ts';

export default function StorageManagerWindow() {
  const autoSave = useSelector((state: RootState) => state.configState.autoSave);

  const [saveAltBrowserOpen, setSaveAltBrowserOpen] = React.useState(false);
  const [importBrowserOpen, setImportBrowserOpen] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState('');

  const fileName = storageManager.parsePath(currentPath).pop() || 'File Name';

  const handleSave = () => {
    if (currentPath === '') {
      setSaveAltBrowserOpen(true);
      return;
    }
    storageManager.save();
  }

  const handleSaveAlt = async (path: string) => {
    setCurrentPath(path);
    storageManager.save(path);
  }

  const handleImport = async (path: string) => {
    setCurrentPath(path);
    storageManager.load(path);
  }

  const handleDelete = async () => {
    storageManager.delete(currentPath)
    .then(deleted => {
      if (deleted) {
        setCurrentPath('');
      }
    });
  }

  return (
    <CardContent>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Typography>{fileName}</Typography>
        </Grid>
        <Grid item xs>
          <ButtonGroup variant="contained" color="primary" fullWidth >
            <Button
              onClick={handleSave}
            ><Save /></Button>
            <Button
              onClick={() => setSaveAltBrowserOpen(true)}
            ><SaveAlt /></Button>
            <Button
              onClick={() => setImportBrowserOpen(true)}
            ><OpenInBrowser /></Button>
            <Button
              color="secondary"
              onClick={() => {
                if (currentPath === '') {
                  return;
                }
                setConfirmDeleteOpen(true);
              }}
            ><Delete /></Button>
          </ButtonGroup>
          <StorageBrowser
            title="Save Alt"
            open={saveAltBrowserOpen}
            close={() => setSaveAltBrowserOpen(false)}
            onPath={handleSaveAlt}
            canCreateFile
          />
          <StorageBrowser
            title="Import"
            open={importBrowserOpen}
            close={() => setImportBrowserOpen(false)}
            onPath={handleImport}
          />
          <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
            <DialogContent>
              {`${fileName} on ${currentPath} will be deleted`}
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  handleDelete();
                  setConfirmDeleteOpen(false);
                }}
              >Confirm</Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setConfirmDeleteOpen(false)}
              >Cancel</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch
              color="primary"
              checked={autoSave}
              onChange={(event, checked) => dispatch(ConfigAction.setAutoSave(checked))}
            />}
            label="Auto Save"
            labelPlacement="start"
          />
        </Grid>
      </Grid>
    </CardContent>
  );
}
