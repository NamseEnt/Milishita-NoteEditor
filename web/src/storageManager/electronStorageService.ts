import StorageServiceBase from "./storageServiceBase";
import { StorageItem, StorageServiceSaveOption, StorageDirectoryEntry, StorageDirectory } from "./types";
import { JSONreviver } from "~NoteView/runTestCode";
import { ElectronMigration } from "~ElectronMigration/ElectronMigration";

const fsExtra = ElectronMigration.fsExtra;
const path = ElectronMigration.path;

export default class ElectronStorageService extends StorageServiceBase {
  public readonly defaultPath = ElectronMigration.cwd;

  public parsePath(pathToParse: string) {
    const {
      root,
      dir,
      base,
    } = path.parse(pathToParse);
    return [root, ...dir.slice(root.length).split(path.sep), base];
  }

  public stringifyPath(pathToStringify: string[]) {
    return path.join(...pathToStringify);
  }

  public async getDirectory(path: string) {
    const directory = await fsExtra.promises.readdir(path, {
      withFileTypes: true
    }).catch(error => {
      console.error(error);
    });

    if (!directory) {
      return null;
    }

    return directory.map(directoryEntry => ({
      isDirectory: directoryEntry.isDirectory(),
      name: directoryEntry.name,
    }));
  }

  public async load(path: string) {
    const storageItem = await fsExtra.readJSON(path, {
      reviver: JSONreviver,
    })
      .catch(error => {
        console.error(error);
        return null;
      }) as StorageItem | null;

    return storageItem;
  }

  public async save(option: StorageServiceSaveOption) {
    const {
      path,
      rootState,
    } = option;

    return await fsExtra.outputJSON(path, rootState)
      .then(() => true)
      .catch(error => {
        console.error(error);
        return false;
      })
  }

  public async delete(path: string) {
    return fsExtra.remove(path)
      .then(() => true)
      .catch(error => {
        console.error(error);
        return false;
      })
  }
}
