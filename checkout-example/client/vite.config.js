import react from '@vitejs/plugin-react';
import { createSNICallback } from 'anchor-pki/auto-cert/sni-callback';
import { TermsOfServiceAcceptor } from 'anchor-pki/auto-cert/terms-of-service-acceptor';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
// import polyfillNode from 'rollup-plugin-polyfill-node';

// Load environment variables from `.env` file
dotenv.config();
// console.log(process.env)


const SNICallback = createSNICallback({
    name: 'sni-callback',
    tosAcceptors: TermsOfServiceAcceptor.createAny(),
    cacheDir: 'tmp/acme'
});

// Vite config
export default defineConfig({
    plugins: [
        react(),
        // polyfillNode(),  // Add Node polyfills
    ],
    server: {
        // https: {
        //     SNICallback
        // },
        // port: process.env.HTTPS_PORT,
        port: 3002,
        host: '0.0.0.0',
        // open: true,
        // proxy: {},  // You can add proxy configurations here if needed
    },
    // build: {
    //     outDir: 'dist',
    //     rollupOptions: {
    //         output: {
    //             // input: path.resolve(__dirname, 'index.js'),
    //             // entryFileNames: 'bundle.js',
    //         },
    //     },
    // },
    resolve: {
        alias: {
            // '@': path.resolve(__dirname, 'src'),
            // path: 'path-browserify',
            // crypto: 'crypto-browserify',
            // stream: 'stream-browserify',
            // buffer: 'buffer',
            // Add other aliases here if necessary
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        // Fallback for Node modules
        dedupe: ['react', 'react-dom'],
    },
    // define: {
    //     // 'process.env': process.env,
    // },
    // optimizeDeps: {
    //     // Add any dependencies that need to be pre-bundled
    // },
});
