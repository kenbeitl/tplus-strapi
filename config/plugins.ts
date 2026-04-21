export default () => ({
    elasticsearch: {
        enabled: true,
        config: {
            searchConnector: {
                host: "https://localhost:9200",
            },
            indexingCronSchedule: "*/5 * * * *",
        },
    },
});
