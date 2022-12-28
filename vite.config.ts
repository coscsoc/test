import { defineConfig } from "vite";
import { mockPlugin } from "./src/index";


let r= import.meta.glob("./a.ts")
console.log(r);
export default defineConfig({
  plugins: [
    mockPlugin({
      prodEnabled: false,
    }),
  ],
});
