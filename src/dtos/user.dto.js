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

    get data() {
        return {
            username: this.#username,
            email: this.#email,
            password: this.#password,
            role: this.#role
        };
    }
}
