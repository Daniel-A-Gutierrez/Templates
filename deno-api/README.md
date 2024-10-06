deno's documentation seems to be out of date, particularly pertaining to deno.json.
(use this)[https://deno.land/x/deno@v1.41.0/cli/schemas/config-file.v1.json?source=].

deno install vs deno add is confusing, add is typical "put this in node modules" behavior,
install is for globally executable scripts 
JK it has various behaviors. Also the docs arent out of date, my Deno is.

OK deno apparently isnt a package manager and has a stupid philosophy so 
deno install -A --unstable --import-map=https://deno.land/x/trex/import_map.json -n trex --no-check https://deno.land/x/trex/cli.ts

using trex

jk

removing the package manager from node and calling it an upgrade is braindead.
seems like using npm/deno vs npm/node is the way to go.

you can install stuff from JSR with 
    npx jsr add @std/async

### server frameworks

I investigated a few, hono with regexp router and zod seems to be best.
https://hono.dev/examples/zod-openapi
Aqua and Wren looked good too but they havent been updated in years.
Faster is also ok but maybe a bit too minimal.
Oak is ok but nothing speical, and also the slowest.

### neat modules

(SuperDeno)[https://github.com/cmorten/superdeno] seems neat for testing api servers.
(Postgres)[https://github.com/denodrivers/postgres] postgres client library
(SQL Builder)[https://github.com/manyuanrong/sql-builder] SQL query builder.
(AloeDB)[https://github.com/Kirlovon/AloeDB] toy database for small projects.

### Review

honestly im not sure if theres a point to using deno.
native ts and formatting are nice.
the testing is nice.

i hate the package management.
Some of the deno specific packages are nice but most of them are old and out of date.
I doubt many of these will work with 2.0.

...
ok i figured out a workaround 
set vendor to true in deno.json
deno install --entrypoint main.ts
configure the tasks to use the --cached-only flag.
deno run main.ts

honestly this feels like trading the difficulty of setting up tsconfig.json for
setting up deno to not be weird.

...

i slept on it. I'm willing to ignore the package management nonsense.
At least its still just one folder to move.
Just have to make sure --cache-only is ALWAYS used.

### Package Management Revised
```deno add``` to add packages
```deno task dev``` to run in development mode

### Deno with Vite
https://github.com/anatoo/vite-deno-plugin/tree/main/examples/react
Seems to be possible. 
Would be useful for doing a fullstack application with deno.
https://github.com/denoland/deno-vite-plugin/blob/main/README.md

### Hono + Astro
https://nuro.dev/posts/how_to_use_astro_with_hono/#binding-hono-to-astro
Seems doable. Use hono for the strongly typed api,
use astro for the frontend stuff.

### TRPC 
this seems like the way to go.
https://github.com/WebDevSimplified/trpc-express-comparison/blob/main/trpc/server/routers/index.ts

https://github.com/jlalmes/trpc-openapi

### Hono's RPC Client
https://hono.dev/docs/guides/rpc
This seems almost nicer than tRPC in many ways. Nice.

### File based routing
Im not entirely sold on this. On one hand it saves alot of boiler plate. But on the other hand, building up the routes at server start means you can't trace types as easily. I feel like it wouldnt work with the RPC Client. How could it?

### Library
I think by separating the logic out from the api endpoints to the library, a neighbor client application (astro) could skip the network and use the api directly. In this case it should be fine so long as 
we're not doing any mutation.

### Adding HTTPS modules
https://github.com/denoland/deno/issues/23216
Adding modules from https is currently not supported. 
I'll have to manually do the import map then do deno install.

### Continuing on Deno 2.0 rc 7 
Very unstable but id rather have a version that matches the docs.

### Package management issues
Turns out a bug i have using zValidator was caused by mismatched versions between
hono and zod and zValidator- zvalidator is only on npm so thats probably the problem. have to use the npm versions for the rest now.


Version: Deno 2.0.0-rc.10

Creating a todo app with hono and zod validator uncovered a problem with type inference in deno. 
Couldn't find a way to resolve it, so I remade the project with npm and node - no type inference issues.
A repository containing the files is [here](https://github.com/Daniel-A-Gutierrez/Templates).
This seems to sometimes fix itself, I'm not entirely sure why. 
I'll update this when I can find out the exact steps to reproduce it. 

![Image](https://github.com/user-attachments/assets/46fe8220-dfe0-4caf-aa13-3374e705a191)

![Image](https://github.com/user-attachments/assets/9755362a-37bb-491c-9058-c261541a69f4)
