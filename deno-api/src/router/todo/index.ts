import create from './post.ts';
import del from './delete.ts';
import read from './get.ts';
import update from './put.ts';
import { createFactory } from 'hono/factory';
import { Hono } from 'hono';
import { AppEnv } from 'src/router/index.ts';
import { Session } from 'src/router/auth/index.ts';

interface TodoEnv extends AppEnv// extends ParentEnv 
{
    Variables : {userId : number, session : Session}
};

const factory = createFactory<TodoEnv>();
const middleware = factory.createMiddleware(async (ctx, next) => 
    {
        ctx.set('userId', ctx.var.session.userId);
        await next();
    } );

const router = new Hono<TodoEnv>().use(middleware)
                                  .route('/gettodos',read)
                                  .route('/deletetodo',del)
                                  .route('/updatetodo',update)
                                  .route('/createtodo',create);
export default router;
export type {TodoEnv};