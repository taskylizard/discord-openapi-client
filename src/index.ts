import createClient, { type Client } from 'openapi-fetch';
import type { paths } from './schema';

export * from './schema';
export const client: Client<paths> = createClient<paths>({
  baseUrl: 'https://discord.com/api/v10'
});
