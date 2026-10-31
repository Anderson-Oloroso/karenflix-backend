export default class Logger {
    static info(entry) {
        console.info(`${entry.timestamp} ${entry.method} ${entry.user} ${entry.route} ${entry.statusCode} ${entry.responseTimeMs}ms`);
    }

    static error(entry) {
        const request = [
            entry.timestamp,
            entry.method,
            entry.user,
            entry.route,
            entry.statusCode,
            entry.responseTimeMs === undefined ? null : `${entry.responseTimeMs}ms`
        ].filter(value => value !== null).join(' ');
        console.error([request, entry.message, entry.stack].filter(Boolean).join('\n'));
    }
}
