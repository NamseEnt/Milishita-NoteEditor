import { ElectronMigration } from "~ElectronMigration/ElectronMigration";
import { WebsocketManager } from "~websocketManager/websocketManager";
import player from "~Config/Player";
import { convertBarSecondToBeat, convertBarBeatToSecond } from "~utils/bar";
import storageManager from "~storageManager/storageManager";
import ElectronStorageService from "~storageManager/electronStorageService";

if (!ElectronMigration.isElectronMigrated) {
  console.log('not electron migrated');
} else {
  console.log('electron migrated');
  console.log('fs: ',  ElectronMigration.fsExtra);
  console.log('websocket server: ', ElectronMigration.websocketServer);
  console.log('cwd: ', ElectronMigration.cwd);
  console.log('path: ', ElectronMigration.path);

  const websocketManager = new WebsocketManager();

  player.on('play', websocketManager.play)
  player.on('stop', websocketManager.stop)
  player.on('seek', (beat: number) => {
    const millisecond = convertBarBeatToSecond(beat) * 1000;
    websocketManager.seek(millisecond);
  })

  websocketManager.on('play', () => player.play(true))
  websocketManager.on('stop', () => player.stop(true))
  websocketManager.on('seek', millisecond => {
    const beat = convertBarSecondToBeat(millisecond / 1000);
    player.seek(beat, true);
  })

  storageManager.addStorageservice('Electron File System', new ElectronStorageService());
}
