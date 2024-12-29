import createClient from 'openapi-fetch';
import type { paths } from './schema';

export * from './schema';
export const client = createClient<paths>({
  baseUrl: 'https://discord.com/api/v10'
});
