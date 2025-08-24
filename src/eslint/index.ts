import { customRule } from "./rules/custom";
import { restrictDirectoryRule } from "./rules/restrict-directory";
import { restrictFilenameRule } from "./rules/restrict-filename";
import { strictIndexRule } from "./rules/strict-index";

const plugin = {
  meta: {
    name: "eslint-plugin-module-restrictions",
  },
  configs: {},
  rules: {
    "restrict-filename": restrictFilenameRule,
    "restrict-directory": restrictDirectoryRule,
    "strict-index": strictIndexRule,
    custom: customRule,
  },
};

Object.assign(plugin.configs, {
  recommended: {
    plugins: { "module-restrictions": plugin },
    rules: {
      "module-restrictions/restrict-filename": "error",
      "module-restrictions/restrict-directory": "error",
      "module-restrictions/strict-index": "error",
      "module-restrictions/custom": "off",
    },
  },
  "no-index-rules": {
    plugins: { "module-restrictions": plugin },
    rules: {
      "module-restrictions/restrict-filename": "error",
      "module-restrictions/restrict-directory": "error",
      "module-restrictions/strict-index": "off",
      "module-restrictions/custom": "off",
    },
  },
  "recommended-legacy": {
    plugins: ["module-restrictions"],
    rules: {
      "module-restrictions/restrict-filename": "error",
      "module-restrictions/restrict-directory": "error",
      "module-restrictions/strict-index": "error",
      "module-restrictions/custom": "off",
    },
  },
  "no-index-rules-legacy": {
    plugins: ["module-restrictions"],
    rules: {
      "module-restrictions/restrict-filename": "error",
      "module-restrictions/restrict-directory": "error",
      "module-restrictions/strict-index": "off",
      "module-restrictions/custom": "off",
    },
  },
});

export default plugin;
