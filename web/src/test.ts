import { ElectronMigration } from "~ElectronMigration/ElectronMigration";

if (!ElectronMigration.isElectronMigrated) {
  console.log('not electron migrated');
} else {
  console.log('electron migrated');
  console.log('fs: ',  ElectronMigration.fsExtra);
}
