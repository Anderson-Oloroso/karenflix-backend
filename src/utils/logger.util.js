export default class Logger {
    static info(entry) {
        const method = `${entry.method}${entry.isPreflight ? ' (preflight)' : ''}`;
        console.info(`${entry.timestamp} ${method} ${entry.route} user: ${entry.user} userId: ${entry.userId} origin: ${entry.origin} allowedOrigin: ${entry.allowedOrigin} ${entry.statusCode} ${entry.responseTimeMs}ms`);
    }

    static error(entry) {
        const request = [
            entry.timestamp,
            `${entry.method}${entry.isPreflight ? ' (preflight)' : ''}`,
            `user: ${entry.user ?? 'anonymous'}`,
            `userId: ${entry.userId ?? 'anonymous'}`,
            entry.route,
            `origin: ${entry.origin ?? 'none'}`,
            `allowedOrigin: ${entry.allowedOrigin ?? 'none'}`,
            entry.statusCode,
            entry.responseTimeMs === undefined ? null : `${entry.responseTimeMs}ms`
        ].filter(value => value !== null).join(' ');
        console.error([request, entry.message, entry.stack].filter(Boolean).join('\n'));
    }
}
