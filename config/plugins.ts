export default () => ({
    elasticsearch: {
        enabled: true,
        config: {
            searchConnector: {
                host: "http://localhost:9200",
            },
            indexingCronSchedule: "*/5 * * * *",
        },
    },
});
