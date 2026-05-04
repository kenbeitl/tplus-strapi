import { Certificate } from 'crypto';
import fs from 'fs';

export default () => ({
    elasticsearch: {
        enabled: true,
        config: {
            searchConnector: {
                host: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
                username: process.env.ELASTICSEARCH_USERNAME,
                password: process.env.ELASTICSEARCH_PASSWORD,
                certificate: process.env.ELASTICSEARCH_CERT_PATH ? fs.readFileSync(process.env.ELASTICSEARCH_CERT_PATH) : undefined,
            },
            indexAliasName: process.env.ELASTICSEARCH_INDEX_ALIAS,
            indexingCronSchedule: process.env.ELASTICSEARCH_CRON_SCHEDULE || "*/5 * * * *",
        },
    },
});