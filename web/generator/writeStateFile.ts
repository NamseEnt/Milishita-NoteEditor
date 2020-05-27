import * as fs from 'fs-extra';
import * as path from 'path';
import { genDir, toPascal, toStateTypeName, toStateFilename } from './utils';

export async function writeStateFile(reducerName: string): Promise<void> {
  const stateFilePath = path.join(genDir, toStateFilename(reducerName));
  const isStateFileAlreadyExisted = await fs.pathExists(stateFilePath);

  if (isStateFileAlreadyExisted) {
    return;
  }

  const stateFileString = `import { Record } from 'immutable';

export class ${toStateTypeName(reducerName)} extends Record<{

}>({

}) {};
`;
  await fs.writeFile(stateFilePath, stateFileString);
}
