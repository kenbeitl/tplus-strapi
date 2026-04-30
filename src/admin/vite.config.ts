import { mergeConfig, type UserConfig } from 'vite';

const allowedHosts = process.env.VITE_ALLOWED_HOSTS
  ? process.env.VITE_ALLOWED_HOSTS.split(',')
  : undefined;

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    ...(allowedHosts ? { server: { allowedHosts } } : {}),
  });
};
