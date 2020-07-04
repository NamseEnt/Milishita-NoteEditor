import type * as fsExtra_ from 'fs-extra';
import type * as path_ from 'path';
import ws from 'ws';

const anyWindow = (window as any);
export namespace ElectronMigration {
  export const isElectronMigrated = anyWindow.isElectronMigrated as boolean;
  export const fsExtra = anyWindow.fs as typeof fsExtra_;
  export const websocketServer = anyWindow.websocketServer as ws.Server;
  export const cwd = anyWindow.cwd as string;
  export const path = anyWindow.path as typeof path_;
}
