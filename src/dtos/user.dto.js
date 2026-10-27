export default class AuthDTO {
    #username;
    #email;
    #password;
    #role;

    constructor(data = {}) {
        this.#username = data.username ? String(data.username).trim() : undefined;
        this.#email = data.email ? String(data.email).trim().toLowerCase() : undefined;
        this.#password = data.password ? String(data.password) : undefined;
        this.#role = data.role;
    }

    get username() { return this.#username; }
    get email() { return this.#email; }
    get password() { return this.#password; }
    get role() { return this.#role; }
}
