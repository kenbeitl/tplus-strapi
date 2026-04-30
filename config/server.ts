export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  ...(env('ALLOWED_HOST') ? { allowedHosts: [env('ALLOWED_HOST')] } : {}),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  routes: {
    prefix: '/strapi-api'
  }
});
