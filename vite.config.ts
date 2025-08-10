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
        "eslint/index": resolve(__dirname, "src/eslint/index.ts"),
      },
      formats: ["cjs"],
    },

    rollupOptions: {
      external: ["typescript", "eslint", "minimatch", "path", "fs"],

      output: [
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          dir: "dist",
          exports: "auto",
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
