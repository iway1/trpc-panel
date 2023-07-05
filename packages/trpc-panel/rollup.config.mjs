// @ts-check
import dts from 'rollup-plugin-dts';
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import * as fs from "node:fs";
import * as path from "node:path";
const isWatching = process.env.ROLLUP_WATCH;

/**
 * @type {{
*   peerDependencies: Record<string, string>;
*   dependencies: Record<string, string>;
*   exports: { ".": { "import": string, "require": string }}
* }}
*/
const { peerDependencies, dependencies, exports } = JSON.parse(
   fs.readFileSync('./package.json', { encoding: 'utf-8' }),
);

const external = [...Object.keys(peerDependencies ?? {}), ...Object.keys(dependencies ?? {})];
/** @type { Array<import('rollup').RollupOptions> } */
export default [
  {
    input: "src/index.ts",
    plugins: [
      typescript({ tsconfig: "tsconfig.buildPanel.json" }),
      json(),
      // resolve(),
      // babel({
      //     exclude: "node_modules/**",
      //     presets: ["@babel/env", "@babel/preset-react"],
      // }),
      // commonjs(),
    ],
    output: [
      { file: "lib/index.js", format: "cjs" },
      { file: "lib/index.mjs", format: "es" },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [
      dts({
        respectExternal: true,
        tsconfig: './tsconfig.json',
        compilerOptions: {
          // see https://github.com/unjs/unbuild/pull/57/files
          preserveSymlinks: false,
          skipLibCheck: true,
        } ,
      }),
    ],
    external,
    output: [
      { file: "./lib/index.d.ts" },
      { file: "./lib/index.d.mts" },
    ],
  },
  {
    input: "src/react-app/index.tsx",
    output: {
      file: "lib/react-app/bundle.js",
      format: "umd",
      sourcemap: true,
      name: "trpc-panel",
    },
    plugins: [
      postcss({
        extract: path.resolve("lib/react-app/index.css"),
      }),
      nodeResolve({
        extensions: [".js", ".ts", ".tsx", "ts"],
      }),
      typescript({ tsconfig: "tsconfig.buildReactApp.json" }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: false,
      }),
      babel({
        presets: [
          [
            "@babel/preset-react",
            {
              development: isWatching,
            },
          ],
        ],
      }),
      commonjs(),
      copy({
        targets: [
          {
            src: "src/react-app/index.html",
            dest: "lib/react-app",
          },
        ],
      }),
      !isWatching && terser(),
    ],
  },
];
