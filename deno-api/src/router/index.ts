import { Hono } from 'hono';
import Auth from '/src/router/auth/index.ts';
import { AuthInfoEnv } from 'src/router/auth/index.ts';
import Todo from '/src/router/todo/index.ts';
import { logger } from 'hono/logger';

export type {AuthInfoEnv as AppEnv};

const router = new Hono().use(logger())
                         .route('/', Auth)
                         .route('/todo', Todo);
    
export default router;