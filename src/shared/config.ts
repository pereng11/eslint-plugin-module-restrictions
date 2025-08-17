export enum Rule {
  SAME_DIRECTORY = "same-directory",
  SHARED_MODULE = "shared-module",
  PRIVATE_MODULE = "private-module",
  INTERNAL_DIRECTORY = "internal-directory",
  NO_DEEP_IMPORT = "no-deep-import",
  AVOID_CIRCULAR_DEPENDENCY = "avoid-circular-dependency",
  CUSTOM = "custom",
}

export const rules = Object.values(Rule);

export interface ModuleRestriction {
  pattern: string;
  rule:
    | Rule.SHARED_MODULE
    | Rule.PRIVATE_MODULE
    | Rule.INTERNAL_DIRECTORY
    | Rule.NO_DEEP_IMPORT
    | Rule.AVOID_CIRCULAR_DEPENDENCY
    | Rule.CUSTOM;
  message?: string;
  allowedImporters?: string[];
}

export const DEFAULT_RESTRICTIONS: ModuleRestriction[] = [
  {
    pattern: "**/*.private.*",
    rule: Rule.PRIVATE_MODULE,
    message:
      "Private modules can only be imported by files with same parent name",
  },
  {
    pattern: "**/*.shared.*",
    rule: Rule.SHARED_MODULE,
    message:
      "Shared modules can only be imported by files with matching parent prefix",
  },
  {
    pattern: "**/_*/**/*",
    rule: Rule.INTERNAL_DIRECTORY,
    message:
      "Files in underscore-prefixed directories can only be imported from the same level or within the directory",
  },
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
