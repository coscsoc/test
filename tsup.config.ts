import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true, // 声明文件
  outDir: "dist",
  format: ["cjs", "esm"],
  clean: true,
  sourcemap: true,
  external: ["esbuild"], // 外部文件不打包
});
