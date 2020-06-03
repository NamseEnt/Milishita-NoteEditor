import * as fs from 'fs-extra';
import * as path from 'path';
import { genDir } from "./utils";

export type Categories = Map<string, Set<string>>;

export async function writeActionTypeCategoriesFile(categories: Categories): Promise<void> {
  const actionTypeCategoryStrings: string[] = [];

  categories.forEach((category, categoryName) => {
    const actionTypeStrings: string[] = [];
    category.forEach(actionType => actionTypeStrings.push(`    '${actionType}',`));
    actionTypeCategoryStrings.push(`  export const ${categoryName}ActionTypes = [
${actionTypeStrings.join('\n')}
  ] as const`)
  });

  const fileContent = `export namespace ActionTypeCategory {
${actionTypeCategoryStrings.join('\n\n')}
}
`;

  const destFile = path.join(genDir, 'actionTypeCategory.ts');

  await fs.writeFile(destFile, fileContent);
}
