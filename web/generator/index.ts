import { genDir, baseDir, toUpperSnake } from "./utils";
import * as path from "path";
import * as fs from 'fs-extra';
import { ParseResult, parser } from "./generateParser";
import { writeStateFile } from "./writeStateFile";
import { writeActionsFile } from './writeActionsFile';
import { writeReducerFile } from "./writeReducerFile";
import { writeRootReducerFile } from "./writeRootReducerFile";
import { writeActionTypeCategoriesFile, Categories } from "./writeActionTypeCategoriesFile";

if (!fs.existsSync(genDir)) {
  fs.mkdirSync(genDir);
}

fs.readdir(baseDir, async (err, files) => {
  if (err) {
    throw err;
  }

  const categories: Categories = new Map<string, Set<string>>();

  const reducerNames = files
    .filter(file => file.endsWith('.gen'))
    .map((file) => {
      const reducerName = file.substring(0, file.lastIndexOf('.gen'));
      return reducerName;
    });

  await Promise.all(files.map(async file => {
    if (!file.endsWith('.gen')) {
      return;
    }
    const reducerName = file.substring(0, file.lastIndexOf('.gen'));
    const sourceFile = await fs.readFile(path.join(baseDir, file), 'utf-8');
    const result = parser.parse(sourceFile) as ParseResult;

    await writeActionsFile(result, reducerName);
    await writeStateFile(reducerName);
    await writeReducerFile(reducerName);

    result.forEach(func => {
      func.categoryList.forEach(categoryName => {
        if (!categories.has(categoryName)) {
          categories.set(categoryName, new Set());
        }

        categories.get(categoryName)?.add(toUpperSnake(func.functionName));
      })
    })

    console.log(`${file} done`);
  }));

  await writeActionTypeCategoriesFile(categories);

  await writeRootReducerFile(reducerNames);
});
