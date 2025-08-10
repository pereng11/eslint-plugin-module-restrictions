import ts from "typescript";
import {
  DEFAULT_RESTRICTIONS,
  type ModuleRestriction,
  shouldIncludeInCompletions,
  validateImport,
} from "../../shared";

interface PluginConfig {
  rules: ModuleRestriction[];
}

function createModuleRestrictionPlugin(
  info: ts.server.PluginCreateInfo
): ts.LanguageService {
  const config: PluginConfig = info.config || { rules: DEFAULT_RESTRICTIONS };

  // 진단 메시지 생성
  function createDiagnostic(
    node: ts.Node,
    message: string
  ): ts.DiagnosticWithLocation {
    return {
      file: node.getSourceFile(),
      start: node.getStart(),
      length: node.getWidth(),
      messageText: message,
      category: ts.DiagnosticCategory.Error,
      code: 9999,
      source: "module-restrictions",
    };
  }

  // 기존 LanguageService 래핑
  const proxy = new Proxy(info.languageService, {
    get(target, prop) {
      const originalMethod = target[prop as keyof ts.LanguageService];

      if (typeof originalMethod === "function") {
        return function (this: any, ...args: any[]) {
          return (originalMethod as (...args: any[]) => any).apply(
            target,
            args
          );
        };
      }

      return originalMethod;
    },
  }) as ts.LanguageService;

  // 1. 자동완성에서 제한된 모듈 필터링
  proxy.getCompletionsAtPosition = (
    fileName: string,
    position: number,
    options?: ts.GetCompletionsAtPositionOptions
  ) => {
    const completions = info.languageService.getCompletionsAtPosition(
      fileName,
      position,
      options
    );

    if (!completions) return completions;

    // import 구문인지 확인
    const sourceFile = info.languageService
      .getProgram()
      ?.getSourceFile(fileName);
    if (!sourceFile) return completions;

    const node = findNodeAtPosition(sourceFile, position);
    if (!isInImportDeclaration(node)) return completions;

    // 제한된 모듈들을 필터링
    completions.entries = completions.entries.filter((entry) => {
      if (entry.kind !== ts.ScriptElementKind.moduleElement) return true;

      return shouldIncludeInCompletions(entry.name, fileName, config.rules);
    });

    return completions;
  };

  // 2. 컴파일 에러 생성
  proxy.getSemanticDiagnostics = (fileName: string) => {
    const diagnostics = info.languageService.getSemanticDiagnostics(fileName);
    const sourceFile = info.languageService
      .getProgram()
      ?.getSourceFile(fileName);

    if (!sourceFile) return diagnostics;

    const restrictionDiagnostics: ts.DiagnosticWithLocation[] = [];

    // import 구문들을 찾아서 검사
    function visit(node: ts.Node) {
      if (
        ts.isImportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const importPath = node.moduleSpecifier.text;

        const result = validateImport(importPath, fileName, config.rules);

        if (!result.isValid) {
          // 첫 번째 위반 사항만 진단 (기존 동작과 동일)
          const violation = result.violations[0];
          restrictionDiagnostics.push(
            createDiagnostic(
              node.moduleSpecifier,
              `Module import restricted: ${violation.message}`
            )
          );
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return [...diagnostics, ...restrictionDiagnostics];
  };

  // 헬퍼 함수들
  function findNodeAtPosition(
    sourceFile: ts.SourceFile,
    position: number
  ): ts.Node | undefined {
    function find(node: ts.Node): ts.Node | undefined {
      if (position >= node.getStart() && position < node.getEnd()) {
        return ts.forEachChild(node, find) || node;
      }
    }
    return find(sourceFile);
  }

  function isInImportDeclaration(node: ts.Node | undefined): boolean {
    while (node) {
      if (ts.isImportDeclaration(node)) return true;
      node = node.parent;
    }
    return false;
  }

  return proxy;
}

export default createModuleRestrictionPlugin;
