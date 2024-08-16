import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess({ postcss: true }),
  kit: {
		adapter: adapter({
			// default options are shown
			out: 'build',
			precompress: true,
			envPrefix: ''
		}),
		// if you are using service workers, ensure this is included
		serviceWorker: {
			register: true,
			files: (filepath) => !/\.DS_Store/.test(filepath)
		}
	}
}
