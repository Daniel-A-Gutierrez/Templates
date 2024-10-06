import {Hono, Schema, Env, type MiddlewareHandler} from "hono";
import { Factory, createFactory, createMiddleware } from 'hono/factory';
import type { BlankSchema } from 'hono/types';

export function MakeFactory<
    E extends Env,
    S extends Schema, 
    BasePath extends string,>
    (r : Hono<E,S,BasePath>) : Factory<E>
{
    return createFactory<E>();
}

// export function CreateMiddleware<
//     E2 extends E1 = any, 
//     E1 extends Env = any, 
//     S extends Schema = BlankSchema, 
//     P extends string = ''>
//     (router : Hono<E1,S,P>, middleware : MiddlewareHandler<E2,P>)
// {
//     return createMiddleware<E2,P>(middleware);
// }

export function MakeMiddlewareFactory<
    E2 extends E1 = any, 
    E1 extends Env = any, 
    S extends Schema = BlankSchema, 
    P extends string = ''>
    (router : Hono<E1,S,P>)
{
    return createMiddleware<E2,P>;
}