export const ROLES = Object.freeze({
    ADMIN: 'admin',
    USER: 'user',
    get all() {
        return [this.ADMIN, this.USER];
    }
});
