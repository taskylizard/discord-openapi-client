import { getUser } from './generated';

const user = await getUser('', {
  headers: {
    Authorization: `Bot ${process.env.TOKEN}`
  }
});

console.info(user);
