import { Hono } from 'hono';
import Auth from '/src/router/auth/index.ts';
import Todo from '/src/router/todo/index.ts';
import { createFactory } from 'hono/factory';

let tracing = createFactory().createMiddleware( async (ctx, next) => 
{
    console.log(ctx.req);
    await next();
    console.log(ctx.res);
})

const router = new Hono().use(tracing)
                         .route('/', Auth)
                         .route('/todo', Todo);
    
export default router;