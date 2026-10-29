export default class UserDTO {
    #username;
    #email;
    #password;

    constructor(data = {}) {
        this.#username = data.username ? String(data.username).trim() : undefined;
        this.#email = data.email ? String(data.email).trim().toLowerCase() : undefined;
        this.#password = data.password ? String(data.password) : undefined;
    }

    get data() {
        return {
            username: this.#username,
            email: this.#email,
            password: this.#password
        };
    }
}
