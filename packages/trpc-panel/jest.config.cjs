/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleDirectories: ["node_modules", __dirname],
    rootDir: "./",
    moduleNameMapper: {
        "src/(.*)": "src",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                diagnostics: {
                    ignoreCodes: [1343],
                },
                astTransformers: {
                    before: [
                        {
                            path: "../../node_modules/ts-jest-mock-import-meta", // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
                            options: {
                                metaObjectReplacement: {
                                    url: "https://www.url.com",
                                },
                            },
                        },
                    ],
                },
            },
        ],
    },
};
