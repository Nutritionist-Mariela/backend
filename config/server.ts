export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: {
      '*/1 * * * *': async () => { // Every 15 minutes
        await strapi.service('api::appointment.appointment').sendPendingEmails();
      },
    },
  },
});
