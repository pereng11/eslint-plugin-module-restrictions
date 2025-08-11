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

    case "shared-module":
      const parentPrefix = importedBasename.split(".")[0];
      return importerBasename.startsWith(parentPrefix);

    case "private-module":
      const importedPrefix = importedBasename.split(".")[0];
      const importerPrefix = importerBasename.split(".")[0];
      return importedPrefix === importerPrefix;

    case "internal-directory":
      // _로 시작하는 폴더 내부의 파일인지 확인
      const importedPathParts = importedPath.split(path.sep);
      const underscoreDirIndex = importedPathParts.findIndex(
        (part) => part.startsWith("_") && part.length > 1
      );

      if (underscoreDirIndex === -1) {
        // _로 시작하는 폴더가 아니면 제한 없음
        return true;
      }

      // underscore 디렉토리 경로 추출
      const underscoreDirPath = importedPathParts
        .slice(0, underscoreDirIndex + 1)
        .join(path.sep);
      const importerPathParts = importerPath.split(path.sep);

      // 같은 레벨에서 import하는 경우 (underscore 디렉토리와 같은 부모 디렉토리)
      const sameLevelImport =
        importerPathParts.slice(0, underscoreDirIndex).join(path.sep) ===
        importedPathParts.slice(0, underscoreDirIndex).join(path.sep);

      // underscore 디렉토리 내부에서 import하는 경우
      const internalImport = importerPath.startsWith(
        underscoreDirPath + path.sep
      );

      return sameLevelImport || internalImport;

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
