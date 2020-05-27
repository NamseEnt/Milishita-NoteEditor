import * as fs from 'fs-extra';
import * as path from 'path';
import { genDir, toPascal, toStateTypeName, toReducerFilename } from './utils';

export async function writeReducerFile(reducerName: string): Promise<void> {
  const filePath = path.join(genDir, toReducerFilename(reducerName));
  const isfileAlreadyExisted = await fs.pathExists(filePath);
  const pascal = toPascal(reducerName);

  if (isfileAlreadyExisted) {
    return;
  }

  const fileString = `export class ${pascal}Reducers implements I${pascal}Reducers {
};

const reducers = new ${pascal}Reducers();

export function ${reducerName}Reducer(
  state: ${pascal}State = new ${pascal}State(),
  action: ${pascal}Actions,
): ${pascal}State {
  const handler = (reducers as any)[action.type] as any;
  if (!handler) {
    return state;
  }
  return handler.bind(reducers)(state, action);
}
`;
  await fs.writeFile(filePath, fileString);
}
