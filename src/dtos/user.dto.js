export class LoginDTO {
    constructor({ username, password } = {}) {
        this.username = String(username ?? '').trim().toLowerCase();
        this.password = String(password ?? '').trim();
    }
}

export class RegisterDTO {
    constructor({ username, email, password, role } = {}) {
        this.username = String(username ?? '').trim().toLowerCase();
        this.email = String(email ?? '').trim().toLowerCase();
        this.password = String(password ?? '').trim();
        this.role = role ?? 'user';
    }
}

export class UserResponseDTO {
    constructor(user = {}) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.created_at;
    }
}