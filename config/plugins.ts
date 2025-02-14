module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'sendgrid',
            providerOptions: {
                apiKey: env('SENDGRID_API_KEY'),
            },
            settings: {
                defaultFrom: env('MAIL_FROM'),
                defaultReplyTo: env('MAIL_REPLY_TO'),
            },
        },
    },
});