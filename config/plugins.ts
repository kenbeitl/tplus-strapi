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
                ...(process.env.ELASTICSEARCH_CERT_PATH ? {
                    tls: {
                        ca: fs.readFileSync(process.env.ELASTICSEARCH_CERT_PATH),
                        rejectUnauthorized: true,
                    },
                } : {}),
            },
            indexAliasName: process.env.ELASTICSEARCH_INDEX_ALIAS,
            indexingCronSchedule: process.env.ELASTICSEARCH_CRON_SCHEDULE || "*/5 * * * *",
        },
    },
});