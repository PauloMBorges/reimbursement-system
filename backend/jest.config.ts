import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',           // ponto de entrada, sem lógica testável
    '!src/config/**',           // env e prisma - bootstrap, não código de negócio
    '!src/shared/types/**',     // só declarações de tipos
    '!src/**/*.routes.ts',      // routes são declarações; testamos via integration
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 55,
      lines: 65,
      statements: 65,
    },
  },

    // Roda testes em série (evita race conditions)
    maxWorkers: 1,
    // Sem isso o processo pdoe travar segurando a conexão do Prisma
    forceExit: true,
    // Mostra cada teste passando individualmente
    verbose: true,

};

export default config;