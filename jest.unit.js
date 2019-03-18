module.exports = {
  verbose: true,
  testEnvironment: "node",
  // testEnvironmentOptions: {
  // resources: 'usable',
  //  runScripts: 'dangerously'
  // },
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  globals: {
    window: {}
  }
};

