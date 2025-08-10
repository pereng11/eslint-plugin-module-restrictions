export interface ModuleRestriction {
  pattern: string;
  rule: "same-directory" | "shared-module" | "private-module" | "custom";
  message?: string;
  allowedImporters?: string[];
}

export const DEFAULT_RESTRICTIONS: ModuleRestriction[] = [
  {
    pattern: "**/*.internal.*",
    rule: "same-directory",
    message: "Internal modules can only be imported within the same directory",
  },
  {
    pattern: "**/*.shared.*",
    rule: "shared-module",
    message:
      "Shared modules can only be imported by files with matching parent prefix",
  },
  {
    pattern: "**/*.private.*",
    rule: "private-module",
    message:
      "Private modules can only be imported by files with same parent name",
  },
];
