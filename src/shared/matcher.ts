import fs from "fs";
import { minimatch } from "minimatch";
import * as path from "path";
import type { ModuleRestriction } from "./config";
import { findClosestIndexDir } from "./util";

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
    case "same-directory": {
      return importedDir === importerDir;
    }
    case "shared-module": {
      const parentPrefix = importedBasename.split(".")[0];
      return importerBasename.startsWith(parentPrefix);
    }
    case "private-module": {
      const importedPrefix = importedBasename.split(".")[0];
      const importerPrefix = importerBasename.split(".")[0];
      return importedPrefix === importerPrefix;
    }
    case "internal-directory": {
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
    }
    case "no-deep-import": {
      // importer가 index면 허용
      if (importerBasename === "index") {
        return true;
      }

      // 임포트된 경로가 디렉토리인 경우 index를 생략한 것으로 간주하고 허용
      try {
        if (fs.statSync(importedPath).isDirectory()) {
          return true;
        }
      } catch {}

      // 임포트된 파일의 모든 상위 디렉토리를 확인
      const closestIndexDir = findClosestIndexDir(importedPath);

      // index 파일이 없으면 제한 없음
      if (closestIndexDir === null) {
        return true;
      }

      // 1. importer와 imported가 같은 레벨에 있는지 확인
      if (importedDir === importerDir) {
        return true;
      }

      // 2. indexDir이 importer와 imported의 공통 부모 디렉토리인지 확인
      const isCommonParent =
        importerPath.startsWith(closestIndexDir) &&
        importedPath.startsWith(closestIndexDir);

      if (isCommonParent) {
        return true;
      }

      // 3. imported가 indexDir이고 imported파일이 index이면 허용
      if (importedDir === closestIndexDir && importedBasename === "index") {
        return true;
      }

      return false;
    }
    case "avoid-circular-dependency": {
      // importer가 index면 허용
      if (importerBasename === "index") {
        return true;
      }

      // 임포트된 파일의 모든 상위 디렉토리를 확인
      const closestIndexDir = findClosestIndexDir(importedPath);

      // index 파일이 없으면 제한 없음
      if (closestIndexDir === null) {
        return true;
      }

      // 1. importer와 imported가 같은 레벨이거나 indexDir이 importer와 imported의 공통 부모 디렉토리인 경우 index import 금지
      const isSameLevel = importedDir === importerDir;
      const isCommonParent =
        importerPath.startsWith(closestIndexDir) &&
        importedPath.startsWith(closestIndexDir);
      let isIndexFileImported = importedBasename === "index";
      try {
        const isDirectory = fs.statSync(importedPath).isDirectory();
        if (isDirectory) {
          isIndexFileImported = true;
        }
      } catch {}

      if (isSameLevel || isCommonParent) {
        return !isIndexFileImported;
      }

      return true;
    }
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
