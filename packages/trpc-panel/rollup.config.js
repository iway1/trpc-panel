import pkg from "./package.json" assert { type: "json" };
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import postcss from "rollup-plugin-postcss";
import path from "path";
const isWatching =
    process.argv.includes("-w") || process.argv.includes("--watch");
console.log("Is watching is " + isWatching);
export default [
    {
        input: "src/index.ts",
        plugins: [
            typescript({ sourceMap: true }),
            json(),
            // resolve(),
            // babel({
            //     exclude: "node_modules/**",
            //     presets: ["@babel/env", "@babel/preset-react"],
            // }),
            // commonjs(),
        ],
        output: [
            { file: pkg.main, format: "cjs", sourcemap: true },
            { file: pkg.module, format: "es" },
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
            typescript(),
            replace({
                "process.env.NODE_ENV": JSON.stringify("production"),
                preventAssignment: false,
            }),
            babel({
                presets: [
                    [
                        "@babel/preset-react",
                        {
                            development: true,
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
