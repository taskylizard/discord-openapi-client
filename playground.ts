import { client } from './src';


const user = await client.GET('/users/{user_id}', {
  params: { path: { user_id: '123456789012345678' } }
});

console.info(user);
