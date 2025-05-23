import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: {
			'$lib': resolve(__dirname, './src/lib')
		}
	},
	build: {
		target: 'esnext',
		lib: {
			entry: 'src/lib/index.ts',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
		},
		rollupOptions: {
			external: ['svelte', '@sveltejs/kit', 'ethers'],
			output: {
				globals: {
					svelte: 'Svelte',
					'@sveltejs/kit': 'SvelteKit',
					ethers: 'ethers'
				}
			}
		}
	},
	optimizeDeps: {
		exclude: ['ethers']
	}
});
