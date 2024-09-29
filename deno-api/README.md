deno's documentation seems to be out of date, particularly pertaining to deno.json.
(use this)[https://deno.land/x/deno@v1.41.0/cli/schemas/config-file.v1.json?source=].

deno install vs deno add is confusing, add is typical "put this in node modules" behavior,
install is for globally executable scripts 
JK it has various behaviors. Also the docs arent out of date, theyre different for 2.0 .

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