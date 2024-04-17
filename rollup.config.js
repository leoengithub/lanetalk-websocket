import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";

export default {
  input: "./src/index.js",
  output: {
    file: "./dist/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    external(),
    resolve(),
    babel({ babelHelpers: "bundled" }),
    terser(),
  ],
};
