/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.tsx?$": ["ts-jest", {}],
    },
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/_mocks_/fileMock.ts',
    },
    setupFiles: ['<rootDir>/jest.setup.ts'],
    
  };