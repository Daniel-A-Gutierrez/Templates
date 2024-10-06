import {hc} from 'hono/client';
import { AppType } from 'src/main.ts';

let client = hc<AppType>( 'http://127.0.0.1:8000/'  ); 
console.log("creating user",  await client['new-user'].$put({json:{username:"me", password:"blenanas"}}));
console.log("logging in" );
const login_response =  await client.login.$put({json:{username:'me', password:"blenanas"}});
const session_key = login_response.headers.getSetCookie()[0];
client = hc<AppType>('http:/127.0.0.1:8000' , {headers : {Cookie : `${session_key}`}});

console.log("fetching todos",  await client.todo['get-todos'].$get());
const new_todo = await (await client.todo['create-todo'].$post({json:{text:"buy bananas"}})).json();
console.log("fetching new todos", await client.todo['get-todos'].$get());
await client.todo['update-todo'].$put({json:{itemId : new_todo.itemId, value: "Buy 7 bananas."}});
console.log("fetching updated todos", await (await client.todo['get-todos'].$get()).json() );
