import fs from 'fs';

export default () => ({
    elasticsearch: {
        enabled: true,
        config: {
            searchConnector: {
                host: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
                ...(process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD ? {
                    auth: {
                        username: process.env.ELASTICSEARCH_USERNAME,
                        password: process.env.ELASTICSEARCH_PASSWORD,
                    },
                } : {}),
                tls: {
                    ...(process.env.ELASTICSEARCH_CERT_PATH ? {
                        ca: fs.readFileSync(process.env.ELASTICSEARCH_CERT_PATH),
                    } : {}),
                    rejectUnauthorized: process.env.ELASTICSEARCH_CERT_PATH ? true : false,
                },
            },
            indexAliasName: process.env.ELASTICSEARCH_INDEX_ALIAS,
            indexingCronSchedule: process.env.ELASTICSEARCH_CRON_SCHEDULE || "*/5 * * * *",
        },
    },
});