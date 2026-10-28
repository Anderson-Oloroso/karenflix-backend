export default class CategoryModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async get(){
        const query = 'SELECT id, name, description, created_at FROM categories';
        const [ rows ] = await this.#db.query(query);
        return rows;
    }

    async getById(id){
        const query = 'SELECT id, name, description, created_at FROM categories WHERE id = ?';
        const [ row ] = await this.#db.query(query, [id]);
        return row[0] ?? null;
    }

    async create(data){
        const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
        const [ result ] = await this.#db.execute(query, [data.name, data.description]);
        return result.insertId;
    }

    async update(data, id){
        const query = 'UPDATE categories SET name = IFNULL(?, name), description = IFNULL(?, description) WHERE id = ?';
        const [ result ] = await this.#db.execute(query, [data.name ?? null, data.description ?? null, id]);
        return result.affectedRows > 0;
    }

    async delete(id){
        const query = 'DELETE FROM categories WHERE id = ?';
        const [ result ] = await this.#db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}
