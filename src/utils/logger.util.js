export default class Logger {
    static info(entry) {
        console.info(`${entry.timestamp} ${entry.method} ${entry.user} ${entry.route} ${entry.statusCode} ${entry.responseTimeMs}ms`);
    }

    static error(entry) {
        console.error(`${entry.timestamp} ${entry.method} ${entry.user} ${entry.route} ${entry.statusCode} ${entry.responseTimeMs}ms`);
    }
}
