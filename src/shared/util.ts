import fs from "fs";
import * as path from "path";

import { INDEX_PATTERNS } from "./const";

export const findClosestIndexDir = (filePath: string) => {
  let currentDir = filePath;

  // 루트 디렉토리에 도달할 때까지 상위로 올라가면서 확인
  while (currentDir !== path.dirname(currentDir)) {
    // 현재 디렉토리에 index 파일이 있는지 확인
    const hasIndex = INDEX_PATTERNS.some((pattern) => {
      const indexPath = path.join(currentDir, pattern);
      return fs.existsSync(indexPath);
    });

    if (hasIndex) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
};
