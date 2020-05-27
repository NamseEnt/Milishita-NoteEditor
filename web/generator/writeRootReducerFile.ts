import * as fs from 'fs-extra';
import * as path from 'path';
import { genDir, toReducerFilenameWithoutExtension } from './utils';

export async function writeRootReducerFile(reducerNames: string[]): Promise<void> {
  const filePath = path.join(genDir, 'rootReducer.ts');

  const fileString = `import { combineReducers } from "redux";
${reducerNames.map(reducerName => {
  return `import { ${reducerName}Reducer } from "./${toReducerFilenameWithoutExtension(reducerName)}";`;
}).join('\n')}

export const rootReducer = combineReducers({
${reducerNames.map(reducerName => {
  return `  ${reducerName}State: ${reducerName}Reducer,`;
}).join('\n')}
});
`;
  await fs.writeFile(filePath, fileString);
}
