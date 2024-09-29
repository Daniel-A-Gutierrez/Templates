import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) =>
{
  return c.text('Hello Hono!');
});

Deno.serve({ port: 8000, hostname: "127.0.0.1" }, app.fetch);

function MakeFileBasedRoutes()
{
  const ROUTES =
    import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(ts|tsx|mdx)', {
      eager: true,
    })

  const routesMap = groupByDirectory(ROUTES)
}