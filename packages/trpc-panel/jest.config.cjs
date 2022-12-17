/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleDirectories: ["node_modules", __dirname],
    rootDir: "./",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1",
    },
    modulePathIgnorePatterns: ["src/render.ts", "src/index.ts"],
};
