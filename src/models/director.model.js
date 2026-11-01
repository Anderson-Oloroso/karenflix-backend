export default class DirectorModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async getAll() {
        const [rows] = await this.#db.execute(
            'SELECT id, name, created_at FROM directors ORDER BY name ASC'
        );
        return rows;
    }

    async getById(id) {
        const [rows] = await this.#db.execute(
            'SELECT id, name, created_at FROM directors WHERE id = ?',
            [id]
        );
        return rows[0] ?? null;
    }

    async getMoviesByDirector(id) {
        const [rows] = await this.#db.execute(
            `SELECT id, title, release_year, image_url, status
            FROM movies
            WHERE director_id = ? AND status = 'approved'
            ORDER BY release_year DESC, title ASC`,
            [id]
        );
        return rows;
    }

    async exists(id) {
        const [rows] = await this.#db.execute(
            'SELECT 1 FROM directors WHERE id = ?',
            [id]
        );
        return rows.length > 0;
    }

    async existsName(name, excludeId = null) {
        let query = 'SELECT 1 FROM directors WHERE name = ?';
        const params = [name];
        if (excludeId !== null) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        const [rows] = await this.#db.execute(query, params);
        return rows.length > 0;
    }

    async create(data) {
        const [result] = await this.#db.execute(
            'INSERT INTO directors (name) VALUES (?)',
            [data.name]
        );
        return result.insertId;
    }

    async update(id, data) {
        const fields = {
            name: 'name'
        };
        const updates = Object.entries(fields)
            .filter(([field]) => Object.hasOwn(data, field))
            .map(([field, column]) => ({ column, value: data[field] }));

        if (updates.length === 0) {
            return false;
        }

        const assignments = updates.map(({ column }) => `${column} = ?`).join(', ');
        const [result] = await this.#db.execute(
            `UPDATE directors SET ${assignments} WHERE id = ?`,
            [...updates.map(({ value }) => value), id]
        );
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await this.#db.execute(
            'DELETE FROM directors WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}
