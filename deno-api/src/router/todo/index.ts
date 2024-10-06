import create from './post.ts';
import del from './delete.ts';
import read from './get.ts';
import update from './put.ts';
import { createFactory } from 'hono/factory';
import { Hono } from 'hono';

interface TodoEnv // extends ParentEnv 
{
    Variables : {userId : number}
};

const factory = createFactory<TodoEnv>();
const middleware = factory.createMiddleware(async (ctx, next) => 
    {
        ctx.set('userId', 0);
        await next();
    } );

const router = new Hono<TodoEnv>().use(middleware)
                                  .route('/get-todos',read)
                                  .route('/delete-todo',del)
                                  .route('/update-todo',update)
                                  .route('/create-todo',create);
export default router;
export type {TodoEnv};