import * as fs from 'fs-extra';
import * as path from 'path';
import { beginMark, genDir, baseDir, toPascal, toUpperSnake, toStateTypeName, toStateFilename, toStateFilenameWithoutExtension, toActionFileName } from "./utils";
import { ParseResult } from './generateParser';

export async function writeActionsFile(parseResult: ParseResult, reducerName: string): Promise<void> {
  const reducerPascalName = toPascal(reducerName);
  const stateTypeName = toStateTypeName(reducerName);

  const importString = `import { ${stateTypeName} } from './${toStateFilenameWithoutExtension(reducerName)}'`;

  const actionTypeStringString = parseResult.map(func => {
    const upperCaseSnakeCase = toUpperSnake(func.functionName);
    return `export const ${upperCaseSnakeCase} = "${upperCaseSnakeCase}" as const;`
  }).join('\n');

  const actionGeneratorString = ` export namespace ${toPascal(reducerName)}Action {
${parseResult.map(func => {
    const upperCaseSnakeCase = toUpperSnake(func.functionName);
    const paramList = func.parameterList.map(param => `${param.name}: ${param.type}`).join(', ');
    const keys = func.parameterList.map(param => `\n      ${param.name},`).join('');

    return `  export function ${func.functionName}(${paramList}) {
    return {
      type: ${upperCaseSnakeCase},${keys}
    };
  }
`;
  }).join('\n\n')}
}
`;

  const actionTypeString = parseResult.map(func => {
    const upperCaseSnakeCase = toUpperSnake(func.functionName);
    const pascalCase = toPascal(func.functionName);
    return `export type ${pascalCase}Action = {
  type: typeof ${upperCaseSnakeCase};${func.parameterList
        .map(param => `\n  ${param.name}: ${param.type};`).join('')}
};
`;
  }).join('\n\n');

  const typesString = `export type ${reducerPascalName}Actions = ${!parseResult.length
    ? 'any'
    : parseResult
      .map(func => func.functionName.substring(0, 1).toUpperCase() + func.functionName.substring(1) + "Action")
      .join(' | ')}`;

  const handlersString = `export interface I${reducerPascalName}Reducers {${parseResult.map(func => {
    const upperCaseSnakeCase = func.functionName.split(/(?=[A-Z])/).join('_').toUpperCase();
    const pascalCase = func.functionName.substring(0, 1).toUpperCase() + func.functionName.substring(1);
    return `\n  ${upperCaseSnakeCase}(state: ${stateTypeName}, action: ${pascalCase}Action): ${stateTypeName};`;
  }).join('')}
};`;

  const destFile = path.join(genDir, `${toActionFileName(reducerName)}.ts`);
  const isFileAlreadyExists = await fs.pathExists(destFile);

  const fileContentList = [
    beginMark,
    actionTypeStringString,
    actionGeneratorString,
    actionTypeString,
    typesString,
    handlersString,
  ];

  if (!isFileAlreadyExists) {
    fileContentList.unshift(importString);
  }

  const fileContent = fileContentList.join('\n\n');

  try {
    const existedDestFile = await fs.readFile(destFile, 'utf-8');
    const beginIndex = existedDestFile.indexOf(beginMark);
    const beforeBeginMark = existedDestFile.substring(0, beginIndex);
    await fs.writeFile(destFile, `${beforeBeginMark}${fileContent}`);
  } catch {
    await fs.writeFile(destFile, fileContent);
  }
}
