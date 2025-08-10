import type { Rule } from "eslint";
import { minimatch } from "minimatch";
import * as path from "path";
import {
  DEFAULT_RESTRICTIONS,
  type ModuleRestriction,
} from "../../shared/config";
import { isImportAllowed } from "../../shared/matcher";

export const restrictImportsRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Restrict module imports based on file naming patterns",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      restrictedImport:
        '{{message}}: "{{importPath}}" cannot be imported from "{{importerPath}}"',
    },
    schema: [
      {
        type: "object",
        properties: {
          restrictions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                pattern: { type: "string" },
                rule: {
                  type: "string",
                  enum: [
                    "same-directory",
                    "parent-prefix",
                    "same-file-prefix",
                    "custom",
                  ],
                },
                message: { type: "string" },
                allowedImporters: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["pattern", "rule"],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const restrictions: ModuleRestriction[] =
      options.restrictions || DEFAULT_RESTRICTIONS;

    return {
      ImportDeclaration(node) {
        if (!node.source || typeof node.source.value !== "string") return;

        const importPath = node.source.value;
        const importerPath = context.getFilename();

        // 실제 파일 경로 해석
        let resolvedPath: string;
        try {
          resolvedPath = path.resolve(path.dirname(importerPath), importPath);
        } catch {
          return; // 경로 해석 실패 시 건너뛰기
        }

        // restrictions의 pattern 중 하나라도 매칭되는지 확인
        const matchedRestrictions = restrictions.filter((restriction) =>
          minimatch(resolvedPath, restriction.pattern)
        );

        // 각 제한 규칙 검사
        for (const restriction of matchedRestrictions) {
          if (isImportAllowed(resolvedPath, importerPath, restriction)) {
            continue;
          }

          context.report({
            node: node.source,
            messageId: "restrictedImport",
            data: {
              message: restriction.message || "Import not allowed",
              importPath,
              importerPath: path.basename(importerPath),
            },
          });
        }
      },
    };
  },
};
