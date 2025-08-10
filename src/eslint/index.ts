import type { ESLint } from "eslint";
import { restrictImportsRule } from "./rules/restrict-imports";

// ESM 스타일로 작성
export const rules = {
  "restrict-imports": restrictImportsRule,
};

export const configs = {
  recommended: {
    plugins: ["module-restrictions"],
    rules: {
      "module-restrictions/restrict-imports": "error",
    },
  },
} satisfies Record<string, ESLint.ConfigData>;

// CommonJS 호환성을 위한 기본 export
export default {
  rules,
  configs,
};
