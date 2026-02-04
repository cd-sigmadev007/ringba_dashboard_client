import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [viteReact(), tailwindcss()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            public: resolve(__dirname, 'public'),
            // @react-pdf/pdfkit browser build imports pako subpaths; ensure Rollup resolves them
            'pako/lib/zlib/zstream.js': resolve(__dirname, 'node_modules/pako/lib/zlib/zstream.js'),
            'pako/lib/zlib/deflate.js': resolve(__dirname, 'node_modules/pako/lib/zlib/deflate.js'),
            'pako/lib/zlib/inflate.js': resolve(__dirname, 'node_modules/pako/lib/zlib/inflate.js'),
            'pako/lib/zlib/constants.js': resolve(__dirname, 'node_modules/pako/lib/zlib/constants.js'),
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
                            proxyReq.setHeader('Cookie', req.headers.cookie)
                        }
                    })
                },
            },
        },
    },
})
