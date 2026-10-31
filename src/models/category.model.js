export default class CategoryModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async get() {
        const query = 'SELECT id, name, description, created_at FROM categories ORDER BY name ASC';
        const [rows] = await this.#db.query(query);
        return rows;
    }

    async getById(id) {
        const query = 'SELECT id, name, description, created_at FROM categories WHERE id = ?';
        const [rows] = await this.#db.query(query, [id]);
        return rows[0] ?? null;
    }

    async exists(id) {
        const query = 'SELECT 1 FROM categories WHERE id = ?';
        const [rows] = await this.#db.query(query, [id]);
        return rows.length > 0;
    }

    async existsName(name, excludeId = null) {
        let query = 'SELECT 1 FROM categories WHERE name = ?';
        const params = [name];
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        const [rows] = await this.#db.query(query, params);
        return rows.length > 0;
    }

    async countMoviesByCategory(categoryId) {
        const [rows] = await this.#db.query(
            'SELECT COUNT(*) AS total FROM movies WHERE category_id = ?',
            [categoryId]
        );
        return rows[0].total;
    }

    async create(data) {
        const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
        const [result] = await this.#db.execute(query, [data.name, data.description]);
        return result.insertId;
    }

    async update(data, id) {
        const query = 'UPDATE categories SET name = IFNULL(?, name), description = IFNULL(?, description) WHERE id = ?';
        const [result] = await this.#db.execute(query, [data.name ?? null, data.description ?? null, id]);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const query = 'DELETE FROM categories WHERE id = ?';
        const [result] = await this.#db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}
