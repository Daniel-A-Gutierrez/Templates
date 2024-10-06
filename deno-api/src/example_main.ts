import { Hono } from 'hono';
import {zValidator} from '@hono/zod-validator';
import {z} from "zod";

//router and app are basically synonymous
const app = new Hono();

const schema = z.object({asdf : z.string()});
const validator1 = zValidator('query', schema);
const validator2 = zValidator('json', schema);

const route = app.get(  '/hello', 
                        validator1, 
                        validator2,
                        (ctx) => 
                        { 
                            const query = ctx.req.valid('query');
                            return ctx.text(`Hello ${query.asdf}`);
                        });

Deno.serve({ port: 8000, hostname: "127.0.0.1" }, app.fetch);

export type AppType = typeof route;
/*
export type ValidationTargets<T extends FormValue = ParsedFormValue, P extends string = string> = {
    json: any;
    form: Record<string, T | T[]>;
    query: Record<string, string | string[]>;
    param: Record<P, P extends `${infer _}?` ? string | undefined : string>;
    header: Record<string, string>;
    cookie: Record<string, string>;
};
*/