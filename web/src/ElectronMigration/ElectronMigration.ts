import type * as fsExtra_ from 'fs-extra';
import ws from 'ws';

const anyWindow = (window as any);
export namespace ElectronMigration {
  export const isElectronMigrated = anyWindow.isElectronMigrated as boolean;
  export const fsExtra = anyWindow.fs as typeof fsExtra_;
  export const websocketServer = anyWindow.websocketServer as ws.Server;
}
