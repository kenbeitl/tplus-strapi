export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  //allowedHosts: ['portal.tplus.ai'],
  app: {
    keys: env.array('APP_KEYS'),
  },
  //url: env('PUBLIC_URL', 'https://portal.tplus.ai/strapi'),
  routes: {
    prefix: '/strapi-api'
  }
});
