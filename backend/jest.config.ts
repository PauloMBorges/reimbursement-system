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

    // Roda testes em série (evita race conditions)
    maxWorkers: 1,
    // Sem isso o processo pdoe travar segurando a conexão do Prisma
    forceExit: true,
    // Mostra cada teste passando individualmente
    verbose: true,

};

export default config;