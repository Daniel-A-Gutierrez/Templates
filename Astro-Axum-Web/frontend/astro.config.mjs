// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import deno from "@deno/astro-adapter";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  image: { domains: ["localhost"]}, // configure this to be your api server or database.
  vite: {css: {transformer: "lightningcss"}},
  output: "server",
  adapter: deno(),
});