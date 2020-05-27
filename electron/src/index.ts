import { app, BrowserWindow } from 'electron';
import * as path from 'path';


function createWindow() {
  const window = new BrowserWindow({
    width: 1,
    height: 1,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
  });

  window.webContents.openDevTools();
  //window.loadFile('index.html');
  window.loadURL('http://localhost:1234');
}

app.whenReady().then(createWindow);