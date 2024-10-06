import Router from './router/index.ts';

Deno.serve({ port: 8000, hostname: "127.0.0.1" }, Router.fetch);

export type AppType = typeof Router;
