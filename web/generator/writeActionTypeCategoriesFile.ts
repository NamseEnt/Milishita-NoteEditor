import * as fs from 'fs-extra';
import * as path from 'path';
import { genDir } from "./utils";

export type Categories = Map<string, Set<string>>;

export async function writeActionTypeCategoriesFile(categories: Categories): Promise<void> {
  const actionTypeCategoryStrings: string[] = [];
  const categoryNames = Array.from(categories.keys()).sort();

  categoryNames.forEach(categoryName => {
    const actionTypeStrings: string[] = [];
    const category = categories.get(categoryName);

    if (!category) {
      return;
    }

    category.forEach(actionType => actionTypeStrings.push(`    '${actionType}',`));
    actionTypeStrings.sort();

    actionTypeCategoryStrings.push(`  export const ${categoryName}ActionTypes = [
${actionTypeStrings.join('\n')}
  ] as const`)
  })

  const fileContent = `export namespace ActionTypeCategory {
${actionTypeCategoryStrings.join('\n\n')}
}
`;

  const destFile = path.join(genDir, 'actionTypeCategory.ts');

  await fs.writeFile(destFile, fileContent);
}
