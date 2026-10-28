export default class ActorModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async get() {
        const query = 'SELECT id, name, biography, birth_date, photo_url, created_at FROM actors ORDER BY name DESC';
        const [rows] = await this.#db.query(query);
        return rows;
    }

    async getById(id) {
        const query = 'SELECT id, name, biography, birth_date, photo_url, created_at FROM actors WHERER id = ?';
        const [rows] = await this.#db.query(query, [id]);
        return rows[0] ?? null;
    }

    async getByName(name) {
        const query = 'SELECT id, name, biography, birth_date, photo_url, created_at FROM actors WHERE name = ?';
        const [rows] = await this.#db.query(query, [name]);
        return rows[0] ?? null;
    }

    async exists(id) {
        const query = 'SELECT 1 FROM actors WHERE id = ?';
        const [rows] = await this.#db.query(query, [id]);
        return rows.length > 0;
    }

    async existsName(name, excludeId = null) {
        let query = 'SELECT 1 FROM actors WHERE name = ?';
        const params = [name];
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        const [rows] = await this.#db.query(query, params);
        return rows.length > 0;
    }

    async create(data) {
        const query = 'INSERT INTO actors (name, biography, birth_date, photo_url) VALUES (?, ?, ?, ?)';
        const [result] = await this.#db.execute(query, [data.name, data.biography, birth_date, photo_url]);
        return result.insertId;
    }

    async update(data, id) {
        const query = 'UPDATE actors SET name = IFNULL(?, name), biography = IFNULL(?, biography), birth_date = IFNULL(?, birth_date), photo_url = IFNULL(?, photo_url) WHERE id = ?';
        const [result] = await this.#db.execute(query, [data.name ?? null, data.description ?? null, id]);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const query = 'DELETE FROM actors WHERE id = ?';
        const [result] = await this.#db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}
