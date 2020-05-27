const fs = require('fs-extra');

(window as any).fs = fs;
(window as any).isElectronMigrated = true;
