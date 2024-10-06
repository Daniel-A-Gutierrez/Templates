import { Hono, Env } from "hono";
import { crypto } from "@std/crypto";
import { UserDB, type User } from '/database/database.ts';
import {createFactory} from 'hono/factory';
import Login from './login.ts';
import Logout from './logout.ts';
import NewUser from './newuser.ts';
import {encodeHex} from '@std/encoding';
import { getCookie } from 'hono/cookie';

//basic bearer auth
interface AuthInfoEnv extends Env
{
    Variables : {session : Session}
}

type Session = 
{
    key : string, 
    userId : number, 
    start : Temporal.Instant 
};

const sessions = new Map<string, Session>();
const factory = createFactory<AuthInfoEnv>();

//normally youd find the max userID but aloedb doesnt support that.
let nextUserId = await UserDB.count(); 

async function login(username : string, password : string) : Promise<Session | null>
{
    const user = await UserDB.findOne( (item) => item.username === username );
    if (user == null) return null;
    const txtEnc = new TextEncoder();
    let testBytes = await txtEnc.encode(user.salt + password);
    testBytes = new Uint8Array( await crypto.subtle.digest('SHA3-256', testBytes));
    if (encodeHex(testBytes) === user.pwHash)
    {
        //create and return session
        const key = crypto.randomUUID();
        const session = {key, userId: user.userId, start : Temporal.Now.instant() };
        sessions.set(key, session);
        return session;
    }
    else {return null;}
}

async function createUser(username : string, password : string) : Promise<User | null>
{
    if ( await UserDB.findOne( (item) => item.username === username) )
    {
        return null;
    }
    const salt = crypto.randomUUID();
    const bytes = new TextEncoder().encode(salt + password);
    const pwHashBytes = new Uint8Array(await crypto.subtle.digest("SHA3-256", bytes ));
    const pwHash = encodeHex(pwHashBytes);
    const userId = nextUserId ;
    nextUserId += 1;
    const new_user = {username, userId, salt, pwHash}
    await UserDB.insertOne(new_user);
    return new_user;
}

async function logout(sessionKey : string) : Promise<{ok : boolean} >
{
    if(sessions.has(sessionKey))
    {
        await sessions.delete(sessionKey);
        return {ok: true};
    }    
    else {return {ok: false}};
}


const bearerAuthValidator = factory.createMiddleware( async (ctx, next) => 
{
    const key = getCookie(ctx, 'session-key');
    if (key == null) return ctx.text('No Session-Key Header Present', 401);
    const session = sessions.get(key);
    if (session == null) return ctx.text('Invalid Session Key');
    const sessionAge = Temporal.Now.instant().since(session.start);
    if ( Temporal.Duration.compare ( sessionAge, 
            Temporal.Duration.from({hours : 24}))> 0 )
    {
        await logout(session.key);
        return ctx.text("Session Expired", 401);
    }
    ctx.set('session', session);
    await next();
});



export {factory, login, createUser, logout}; 
export type {AuthInfoEnv};

const router = new Hono<AuthInfoEnv>().route('/', Login)
                                      .route('/', NewUser)
                                      .use(bearerAuthValidator)
                                      .route('/', Logout);
                                      
export default router;