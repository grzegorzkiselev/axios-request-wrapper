import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "html"],
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: __dirname,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  verbose: true,
};

export default config;
