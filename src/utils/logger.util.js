export default class Logger {
    static info(entry) {
        console.info(JSON.stringify(entry));
    }

    static error(entry) {
        console.error(JSON.stringify(entry));
    }
}
