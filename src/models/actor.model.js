export default class ActorModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async get() {
        const query = 'SELECT id, name, biography, birth_date, photo_url, created_at FROM actors ORDER BY name ASC';
        const [rows] = await this.#db.query(query);
        return rows;
    }

    async getById(id) {
        const query = 'SELECT id, name, biography, birth_date, photo_url, created_at FROM actors WHERE id = ?';
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
        const [result] = await this.#db.execute(query, [
            data.name,
            data.biography ?? null,
            data.birth_date ?? null,
            data.photo_url ?? null
        ]);
        return result.insertId;
    }

    async update(data, id) {
        const fields = {
            name: 'name',
            biography: 'biography',
            birth_date: 'birth_date',
            photo_url: 'photo_url'
        };
        const updates = Object.entries(fields)
            .filter(([field]) => Object.hasOwn(data, field))
            .map(([field, column]) => ({ column, value: data[field] }));

        if (updates.length === 0) {
            return false;
        }

        const assignments = updates.map(({ column }) => `${column} = ?`).join(', ');
        const query = `UPDATE actors SET ${assignments} WHERE id = ?`;
        const [result] = await this.#db.execute(query, [...updates.map(({ value }) => value), id]);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const query = 'DELETE FROM actors WHERE id = ?';
        const [result] = await this.#db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}
