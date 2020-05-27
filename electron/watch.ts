import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

let requested = true;

const pathes = [
  path.join(__dirname, "src"),
  path.join(__dirname, "package.json"),
];

pathes.forEach(path => {
  fs.watch(path, {
    recursive: true,
  }, () => {
    requested = true;
  });
});


let tscProcess: ReturnType<typeof spawn> | undefined = undefined;
let electronProcess: ReturnType<typeof spawn> | undefined = undefined;

function RunTsc() {
  return new Promise((resolve, reject) => {
    tscProcess = spawn(path.join(__dirname, 'node_modules/.bin/tsc.cmd'));
    tscProcess.stdout?.on('data', (data) => {
      console.log(data);
    });
    tscProcess.stderr?.on('data', (data) => {
      console.error(data);
    })
    tscProcess.on('close', (code) => {
      tscProcess = undefined;
      resolve();
    });
  });
}

function RunElectorn() {
  return new Promise((resolve, reject) => {
    const electronPath = path.join(__dirname, 'node_modules/.bin/electron.cmd');
    electronProcess = spawn(electronPath, [
      path.resolve(__dirname, 'dist/index.js'),
    ]);
    electronProcess.stdout?.on('data', (data) => {
    });
    electronProcess.stderr?.on('data', (data) => {
    })
    electronProcess.on('close', (code) => {
      resolve();
    });
  });
}


let isRunning = false;

setInterval(async () => {
  if (isRunning || !requested) {
    return;
  }

  isRunning = true;
  requested = false;

  console.log('TSC');
  await RunTsc();
  console.log('TSC - done');
  if (electronProcess) {
    spawn("taskkill", ["/pid", electronProcess.pid.toString(), '/f', '/t']);
    electronProcess = undefined;
  }
  RunElectorn();

  isRunning = false;
}, 100);