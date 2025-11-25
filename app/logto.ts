import { UserScope, type LogtoNextConfig } from '@logto/next';

export const logtoConfig: LogtoNextConfig = {
  endpoint: 'https://1hpfkn.logto.app/',
  appId: 'nn088mygrtjt9y8wma3rt',
  appSecret: '2BgCfSd7dJ4dpjxx2zRH822PBvLetwik',
  baseUrl: 'http://192.168.20.127:3000', // Change to your own base URL
  cookieSecret: 'm1KGHj9yNBOlxQmOaGAukKKnrVSPkTwK', // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === 'production',
  scopes: [UserScope.Email],
};
