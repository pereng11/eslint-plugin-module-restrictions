import { minimatch } from "minimatch";
import * as path from "path";
import type { ModuleRestriction } from "./config";
import { isImportAllowed } from "./matcher";

export interface ValidationResult {
  isValid: boolean;
  violations: Array<{
    restriction: ModuleRestriction;
    message: string;
  }>;
}

export function validateImport(
  importPath: string,
  importerPath: string,
  restrictions: ModuleRestriction[]
): ValidationResult {
  const violations: Array<{
    restriction: ModuleRestriction;
    message: string;
  }> = [];

  // 실제 파일 경로 해석
  let resolvedPath: string;
  try {
    resolvedPath = path.resolve(path.dirname(importerPath), importPath);
  } catch {
    // 경로 해석 실패 시 유효한 것으로 처리
    return { isValid: true, violations: [] };
  }

  // restrictions의 pattern 중 하나라도 매칭되는지 확인
  const matchedRestrictions = restrictions.filter((restriction) =>
    Array.isArray(restriction.pattern)
      ? restriction.pattern.some((pattern) => minimatch(resolvedPath, pattern))
      : minimatch(resolvedPath, restriction.pattern)
  );

  // 각 제한 규칙 검사
  for (const restriction of matchedRestrictions) {
    if (!isImportAllowed(resolvedPath, importerPath, restriction)) {
      violations.push({
        restriction,
        message: restriction.message || "Import not allowed",
      });
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}
