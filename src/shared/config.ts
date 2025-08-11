export enum Rule {
  SAME_DIRECTORY = "same-directory",
  SHARED_MODULE = "shared-module",
  PRIVATE_MODULE = "private-module",
  INTERNAL_DIRECTORY = "internal-directory",
  CUSTOM = "custom",
}

export const rules = Object.values(Rule);

export interface ModuleRestriction {
  pattern: string;
  rule:
    | Rule.SAME_DIRECTORY
    | Rule.SHARED_MODULE
    | Rule.PRIVATE_MODULE
    | Rule.INTERNAL_DIRECTORY
    | Rule.CUSTOM;
  message?: string;
  allowedImporters?: string[];
}

export const DEFAULT_RESTRICTIONS: ModuleRestriction[] = [
  {
    pattern: "**/*.internal.*",
    rule: Rule.SAME_DIRECTORY,
    message: "Internal modules can only be imported within the same directory",
  },
  {
    pattern: "**/*.shared.*",
    rule: Rule.SHARED_MODULE,
    message:
      "Shared modules can only be imported by files with matching parent prefix",
  },
  {
    pattern: "**/*.private.*",
    rule: Rule.PRIVATE_MODULE,
    message:
      "Private modules can only be imported by files with same parent name",
  },
  {
    pattern: "**/_*/**/*",
    rule: Rule.INTERNAL_DIRECTORY,
    message:
      "Files in underscore-prefixed directories can only be imported from the same level or within the directory",
  },
];
