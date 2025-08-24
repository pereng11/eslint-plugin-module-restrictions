import type { Rule as ESLintRule } from "eslint";
import * as path from "path";
import { type ModuleRestriction, Rule, validateImport } from "../../shared";
import { mergeRestrictions } from "../../shared/util";

const STRICT_INDEX_RULES: Rule[] = [
  Rule.NO_DEEP_IMPORT,
  Rule.AVOID_CIRCULAR_DEPENDENCY,
];

const DEFAULT_RESTRICTIONS: ModuleRestriction[] = [
  {
    pattern: "**/*",
    rule: Rule.NO_DEEP_IMPORT,
    message:
      "When an index file exists, modules within a directory can only be accessed through its index file",
  },
  {
    pattern: "**/*",
    rule: Rule.AVOID_CIRCULAR_DEPENDENCY,
    message:
      "Avoid importing through index file within the same module to prevent circular dependencies",
  },
];

export const strictIndexRule: ESLintRule.RuleModule = {
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
                  enum: STRICT_INDEX_RULES,
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
    const restrictions: ModuleRestriction[] = mergeRestrictions(
      DEFAULT_RESTRICTIONS,
      options.restrictions || []
    );

    return {
      ImportDeclaration(node) {
        if (!node.source || typeof node.source.value !== "string") return;

        const importPath = node.source.value;
        const importerPath = context.getFilename();

        const result = validateImport(importPath, importerPath, restrictions);

        if (!result.isValid) {
          // 첫 번째 위반 사항만 리포트 (기존 동작과 동일)
          const violation = result.violations[0];
          context.report({
            node: node.source,
            messageId: "restrictedImport",
            data: {
              message: violation.message,
              importPath,
              importerPath: path.basename(importerPath),
            },
          });
        }
      },
    };
  },
};
