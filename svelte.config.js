import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib'
    },
    package: {
      dir: 'package' // ✅ This tells svelte-package to output to "package/"
    }
  }
};

export default config;
