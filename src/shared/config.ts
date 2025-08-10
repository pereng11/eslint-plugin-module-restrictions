export interface ModuleRestriction {
  pattern: string;
  rule: "same-directory" | "parent-prefix" | "same-file-prefix" | "custom";
  message?: string;
  allowedImporters?: string[];
}

export const DEFAULT_RESTRICTIONS_PATTERN = {
  INTERNAL: "**/*.internal.*",
  SUB: "**/*.sub.*",
  PRIVATE: "**/*.private.*",
} as const;

export const DEFAULT_RESTRICTIONS: ModuleRestriction[] = [
  {
    pattern: DEFAULT_RESTRICTIONS_PATTERN.INTERNAL,
    rule: "same-directory",
    message: "Internal modules can only be imported within the same directory",
  },
  {
    pattern: DEFAULT_RESTRICTIONS_PATTERN.SUB,
    rule: "parent-prefix",
    message:
      "Sub modules can only be imported by files with matching parent prefix",
  },
  {
    pattern: DEFAULT_RESTRICTIONS_PATTERN.PRIVATE,
    rule: "same-file-prefix",
    message: "Private modules can only be imported by files with same prefix",
  },
];
