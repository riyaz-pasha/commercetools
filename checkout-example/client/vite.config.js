import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
// import polyfillNode from 'rollup-plugin-polyfill-node';

// Load environment variables from `.env` file
dotenv.config();

// Vite config
export default defineConfig({
    plugins: [
        react(),
        // polyfillNode(),  // Add Node polyfills
    ],
    server: {
        open: true,
        port: 3002,
        hot: true,
        host: '0.0.0.0',
        proxy: {},  // You can add proxy configurations here if needed
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
    define: {
        'process.env': process.env,
    },
    optimizeDeps: {
        // Add any dependencies that need to be pre-bundled
    },
});
