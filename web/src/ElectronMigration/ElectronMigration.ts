import type * as fsExtra_ from 'fs-extra';

const anyWindow = (window as any);
export namespace ElectronMigration {
  export const isElectronMigrated = anyWindow.isElectronMigrated as boolean;
  export const fsExtra = anyWindow.fs as typeof fsExtra_;
}
