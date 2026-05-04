// Config do ESLint integrado com Prettier e regras do TypeScript

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    // Regras base do JavaScript
    js.configs.recommended,

    // Regras do TypeScript
    ...tseslint.configs.recommended,

    // Configurações do projeto
    {
        files: ['src/**/*.ts', 'prisma/**/*.ts', 'tests/**/*.ts'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }, // Ignora variáveis que começam com _
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'off', // permitido em dev/seed
        },
    },

    prettierConfig,

    // Ignora pastas
    {
        ignores: ['dist/**', 'node_modules/**', 'prisma/migrations/**'],
    },
];