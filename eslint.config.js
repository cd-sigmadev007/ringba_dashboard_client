// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
    {
        ignores: ['*.config.js', 'scripts/**/*.js'],
    },
    ...tanstackConfig,
    {
        // Global rules override
        rules: {
            '@typescript-eslint/no-unnecessary-condition': 'off',
        },
    },
    {
        // Override PNPM rules for package.json
        files: ['package.json', '**/package.json'],
        rules: {
            'pnpm/json-enforce-catalog': 'off',
            'pnpm/json-valid-catalog': 'off',
            'pnpm/json-prefer-workspace-settings': 'off',
        },
    },
    {
        // Override PNPM rules for pnpm-workspace.yaml
        files: ['pnpm-workspace.yaml'],
        rules: {
            'pnpm/yaml-no-unused-catalog-item': 'off',
            'pnpm/yaml-no-duplicate-catalog-item': 'off',
        },
    },
]
