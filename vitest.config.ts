import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [viteReact(), tailwindcss()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./test/src/setup.ts'],
        include: ['test/**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                '**/*.test.{ts,tsx}',
                '**/*.spec.{ts,tsx}',
                '**/index.ts',
                '**/index.tsx',
            ],
            include: ['src/**/*.{ts,tsx}'],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            public: resolve(__dirname, 'public'),
        },
    },
})
