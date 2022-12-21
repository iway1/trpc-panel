/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  // moduleDirectories: ["node_modules", __dirname],
  //   modulePaths: ["<rootDir>/src", "<rootDir>/node_modules"],
  //   rootDir: "./",
  //   transform: {
  //     "^.+\\.tsx?$": "ts-jest",
  //   },
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["src/render.ts", "src/index.ts", "utils", "lib"],
};
