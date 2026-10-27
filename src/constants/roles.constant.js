export class Roles {
    static ADMIN  = 'admin';
    static USER = 'user';

    static getAll(){
        return [this.ADMIN, this.USER];
    }
}