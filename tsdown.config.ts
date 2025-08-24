import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/eslint/index.ts"],
  outDir: "./dist",
  format: ["esm", "cjs"],
  dts: true,
});
