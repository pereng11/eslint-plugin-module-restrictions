import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "node_modules/**"],
    }),
  ],

  build: {
    lib: {
      entry: {
        // ESLint 플러그인 (CommonJS)
        "eslint/index": resolve(__dirname, "src/eslint/index.ts"),
        // TypeScript 플러그인 (ESM + CommonJS 호환)
        "typescript/index": resolve(__dirname, "src/typescript/index.ts"),
      },
      formats: ["cjs", "es"], // 두 형식 모두 지원
    },

    rollupOptions: {
      external: ["typescript", "eslint", "minimatch", "path", "fs"],

      output: [
        // CommonJS 출력 (ESLint용)
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          dir: "dist",
          exports: "auto",
        },
        // ESM 출력 (TypeScript/현대적 사용)
        {
          format: "es",
          entryFileNames: "[name].mjs",
          dir: "dist",
          exports: "named",
        },
      ],
    },

    minify: false, // 디버깅을 위해 minify 비활성화
    sourcemap: true,
    target: "node16", // Node.js 16+ 지원
  },

  // 개발 시 Node.js 환경 시뮬레이션
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
});
