import { describe, expect, it } from "vitest";
import type { ModuleRestriction } from "./config";
import { isImportAllowed } from "./matcher";

describe("isImportAllowed", () => {
  describe("same-directory rule", () => {
    const restriction: ModuleRestriction = {
      pattern: "**/*.internal.*",
      rule: "same-directory",
      message:
        "Internal modules can only be imported within the same directory",
    };

    it("should allow import when files are in the same directory", () => {
      const importedPath = "/project/src/components/Button.internal.ts";
      const importerPath = "/project/src/components/Button.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should deny import when files are in different directories", () => {
      const importedPath = "/project/src/components/Button.internal.ts";
      const importerPath = "/project/src/pages/Home.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        false
      );
    });

    it("should handle nested directories correctly", () => {
      const importedPath = "/project/src/components/ui/Button.internal.ts";
      const importerPath = "/project/src/components/ui/Button.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });
  });

  describe("parent-prefix rule", () => {
    const restriction: ModuleRestriction = {
      pattern: "**/*.sub.*",
      rule: "parent-prefix",
      message:
        "Sub modules can only be imported by files with matching parent prefix",
    };

    it("should allow import when importer has matching parent prefix", () => {
      const importedPath = "/project/src/components/Button.sub.ts";
      const importerPath = "/project/src/components/Button.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should allow import when importer has parent prefix", () => {
      const importedPath = "/project/src/components/Button.sub.ts";
      const importerPath = "/project/src/components/ButtonGroup.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should deny import when importer has different prefix", () => {
      const importedPath = "/project/src/components/Button.sub.ts";
      const importerPath = "/project/src/components/Input.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        false
      );
    });

    it("should handle complex prefixes correctly", () => {
      const importedPath = "/project/src/components/ButtonGroup.sub.ts";
      const importerPath = "/project/src/components/ButtonGroupContainer.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });
  });

  describe("same-file-prefix rule", () => {
    const restriction: ModuleRestriction = {
      pattern: "**/*.private.*",
      rule: "same-file-prefix",
      message: "Private modules can only be imported by files with same prefix",
    };

    it("should allow import when files have same prefix", () => {
      const importedPath = "/project/src/components/Button.private.ts";
      const importerPath = "/project/src/components/Button.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should deny import when files have different prefixes", () => {
      const importedPath = "/project/src/components/Button.private.ts";
      const importerPath = "/project/src/components/Input.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        false
      );
    });

    it("should handle complex prefixes correctly", () => {
      const importedPath = "/project/src/components/ButtonGroup.private.ts";
      const importerPath = "/project/src/components/ButtonGroup.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should handle files with multiple dots correctly", () => {
      const importedPath = "/project/src/components/Button.private.utils.ts";
      const importerPath = "/project/src/components/Button.utils.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });
  });

  describe("custom rule", () => {
    const restriction: ModuleRestriction = {
      pattern: "**/*.custom.*",
      rule: "custom",
      message: "Custom restriction",
      allowedImporters: ["**/allowed/**", "**/special/**"],
    };

    it("should allow import when importer matches allowed pattern", () => {
      const importedPath = "/project/src/components/Button.custom.ts";
      const importerPath = "/project/src/allowed/Component.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should allow import when importer matches special pattern", () => {
      const importedPath = "/project/src/components/Button.custom.ts";
      const importerPath = "/project/src/special/Component.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should deny import when importer doesn't match any pattern", () => {
      const importedPath = "/project/src/components/Button.custom.ts";
      const importerPath = "/project/src/components/Component.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        false
      );
    });

    it("should allow all imports when no allowedImporters specified", () => {
      const restrictionWithoutAllowed: ModuleRestriction = {
        pattern: "**/*.custom.*",
        rule: "custom",
        message: "Custom restriction",
      };

      const importedPath = "/project/src/components/Button.custom.ts";
      const importerPath = "/project/src/components/Component.ts";

      expect(
        isImportAllowed(importedPath, importerPath, restrictionWithoutAllowed)
      ).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle files without extensions", () => {
      const restriction: ModuleRestriction = {
        pattern: "**/*.internal.*",
        rule: "same-directory",
      };

      const importedPath = "/project/src/components/Button.internal";
      const importerPath = "/project/src/components/Button";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should handle files with multiple extensions", () => {
      const restriction: ModuleRestriction = {
        pattern: "**/*.internal.*",
        rule: "same-directory",
      };

      const importedPath = "/project/src/components/Button.internal.test.ts";
      const importerPath = "/project/src/components/Button.test.ts";

      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });

    it("should handle unknown rule types", () => {
      const restriction: ModuleRestriction = {
        pattern: "**/*.unknown.*",
        rule: "unknown" as any,
      };

      const importedPath = "/project/src/components/Button.unknown.ts";
      const importerPath = "/project/src/components/Button.ts";

      // Unknown rules should default to allowing imports
      expect(isImportAllowed(importedPath, importerPath, restriction)).toBe(
        true
      );
    });
  });
});
