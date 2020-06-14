import websocketServer from './websocketServer';

const fs = require('fs-extra');

(window as any).fs = fs;
(window as any).isElectronMigrated = true;
(window as any).websocketServer = websocketServer;
