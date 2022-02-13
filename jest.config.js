module.exports = {
    roots: ['<rootDir>/src', '<rootDir>/src/test'],
    testEnvironment: 'node',
    transform: {
      '^.+\\.js?$': 'babel-jest',
    },
    moduleNameMapper: {
      '~/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['<rootDir>/**/*.test.js']
}