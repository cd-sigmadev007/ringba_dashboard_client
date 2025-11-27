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
    server: {
        proxy: {
            // Proxy API requests to backend to make them same-origin
            // This allows cookies to work with sameSite: 'lax' in development
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: '',
                cookiePathRewrite: '/',
                // Ensure cookies are forwarded
                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        // Forward cookies from the original request
                        if (req.headers.cookie) {
                            proxyReq.setHeader('Cookie', req.headers.cookie);
                        }
                    });
                },
            },
        },
    },
})
