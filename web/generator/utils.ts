import * as path from 'path';

export function toUpperSnake(camelOrPascal: string): string {
  return camelOrPascal.split(/(?=[A-Z])/).join('_').toUpperCase();
}

export function toPascal(camel: string): string {
  return camel.substring(0, 1).toUpperCase() + camel.substring(1);
}

export function toStateTypeName(reducerName: string): string {
  return `${toPascal(reducerName)}State`;
}

export function toStateFilenameWithoutExtension(reducerName: string): string {
  return `${reducerName}_state`;
};

export function toStateFilename(reducerName: string): string {
  return `${toStateFilenameWithoutExtension(reducerName)}.ts`;
};

export function toReducerFilenameWithoutExtension(reducerName: string): string {
  return `${reducerName}_reducers`;
};

export function toReducerFilename(reducerName: string): string {
  return `${toReducerFilenameWithoutExtension(reducerName)}.ts`;
};

export function toActionFileName(reducerName: string): string {
  return `${reducerName}_action.ts`;
};

export const beginMark = '///BEGIN'
export const baseDir = path.join(__dirname ,'../src/StateStore');
export const genDir = path.join(baseDir, '_gen');
