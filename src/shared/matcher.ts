import { minimatch } from "minimatch";
import * as path from "path";
import type { ModuleRestriction } from "./config";

export function isImportAllowed(
  importedPath: string,
  importerPath: string,
  restriction: ModuleRestriction
): boolean {
  const importedDir = path.dirname(importedPath);
  const importerDir = path.dirname(importerPath);
  const importedBasename = path.basename(
    importedPath,
    path.extname(importedPath)
  );
  const importerBasename = path.basename(
    importerPath,
    path.extname(importerPath)
  );

  switch (restriction.rule) {
    case "same-directory":
      return importedDir === importerDir;

    case "parent-prefix":
      const parentPrefix = importedBasename.split(".")[0];
      return importerBasename.startsWith(parentPrefix);

    case "same-file-prefix":
      const importedPrefix = importedBasename.split(".")[0];
      const importerPrefix = importerBasename.split(".")[0];
      return importedPrefix === importerPrefix;

    case "custom":
      return (
        restriction.allowedImporters?.some((pattern) =>
          minimatch(importerPath, pattern)
        ) ?? true
      );

    default:
      return true;
  }
}
