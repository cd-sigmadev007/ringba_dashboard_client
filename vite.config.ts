import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [viteReact(), tailwindcss()],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    test: {
        globals: true,
        environment: 'jsdom',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            public: resolve(__dirname, 'public'),
        },
    },
})
