import websocketServer from './websocketServer';

const fs = require('fs-extra');
const path = require('path');

(window as any).fs = fs;
(window as any).isElectronMigrated = true;
(window as any).websocketServer = websocketServer;
(window as any).cwd = process.cwd();
(window as any).path = path;
