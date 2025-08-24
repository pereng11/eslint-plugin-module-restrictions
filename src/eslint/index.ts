import { restrictImportsRule } from "./rules/restrict-imports";

// ESLint flat config 표준에 맞는 플러그인 객체
const plugin = {
  meta: {
    name: "eslint-plugin-module-restrictions",
  },
  configs: {},
  rules: {
    "restrict-imports": restrictImportsRule,
  },
};

Object.assign(plugin.configs, {
  recommended: {
    plugins: { "module-restrictions": plugin },
    rules: {
      "module-restrictions/restrict-imports": "error",
    },
  },
  "recommended-legacy": {
    plugins: ["module-restrictions"],
    rules: {
      "module-restrictions/restrict-imports": "error",
    },
  },
});

export default plugin;
