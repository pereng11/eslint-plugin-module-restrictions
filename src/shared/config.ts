export enum Rule {
  SAME_DIRECTORY = "same-directory",
  SHARED_MODULE = "shared-module",
  PRIVATE_MODULE = "private-module",
  INTERNAL_DIRECTORY = "internal-directory",
  NO_DEEP_IMPORT = "no-deep-import",
  AVOID_CIRCULAR_DEPENDENCY = "avoid-circular-dependency",
  CUSTOM = "custom",
}

export interface ModuleRestriction {
  pattern: string | string[];
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
