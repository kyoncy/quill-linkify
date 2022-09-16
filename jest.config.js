const config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testMatch: [
    "**/tests/**/*.test.ts"
  ]
}

module.exports = config;
