export default class MovieActorModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async getAll() {
        const query = `
            SELECT
                ma.id,
                ma.movie_id,
                ma.actor_id,
                ma.character_name,
                m.title AS movie_title,
                m.description AS movie_description,
                m.image_url AS movie_image_url,
                m.release_year,
                a.name AS actor_name,
                a.photo_url AS actor_photo_url
            FROM movie_actors ma
            INNER JOIN movies m ON m.id = ma.movie_id
            INNER JOIN actors a ON a.id = ma.actor_id
            ORDER BY ma.id DESC
        `;
        const [rows] = await this.#db.query(query);
        return rows;
    }

    async getById(id) {
        const query = `
            SELECT
                ma.id,
                ma.movie_id,
                ma.actor_id,
                ma.character_name,
                m.title AS movie_title,
                m.description AS movie_description,
                m.image_url AS movie_image_url,
                m.release_year,
                a.name AS actor_name,
                a.photo_url AS actor_photo_url
            FROM movie_actors ma
            INNER JOIN movies m ON m.id = ma.movie_id
            INNER JOIN actors a ON a.id = ma.actor_id
            WHERE ma.id = ?
        `;
        const [rows] = await this.#db.execute(query, [id]);
        return rows[0] ?? null;
    }

    async getByMovieId(movieId) {
        const query = `
            SELECT
                ma.id,
                ma.movie_id,
                ma.actor_id,
                ma.character_name,
                a.name AS actor_name,
                a.photo_url AS actor_photo_url
            FROM movie_actors ma
            INNER JOIN actors a ON a.id = ma.actor_id
            WHERE ma.movie_id = ?
            ORDER BY ma.id ASC
        `;
        const [rows] = await this.#db.execute(query, [movieId]);
        return rows;
    }

    async getByActorId(actorId) {
        const query = `
            SELECT
                ma.id,
                ma.movie_id,
                ma.actor_id,
                ma.character_name,
                m.title AS movie_title,
                m.description AS movie_description,
                m.image_url AS movie_image_url,
                m.release_year
            FROM movie_actors ma
            INNER JOIN movies m ON m.id = ma.movie_id
            WHERE ma.actor_id = ?
            ORDER BY m.release_year DESC
        `;
        const [rows] = await this.#db.execute(query, [actorId]);
        return rows;
    }

    async exists(id) {
        const query = 'SELECT 1 FROM movie_actors WHERE id = ?';
        const [rows] = await this.#db.execute(query, [id]);
        return rows.length > 0;
    }

    async existsRelation(movieId, actorId, excludeId = null) {
        let query = 'SELECT 1 FROM movie_actors WHERE movie_id = ? AND actor_id = ?';
        const params = [movieId, actorId];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await this.#db.execute(query, params);
        return rows.length > 0;
    }

    async movieExists(movieId) {
        const query = 'SELECT 1 FROM movies WHERE id = ?';
        const [rows] = await this.#db.execute(query, [movieId]);
        return rows.length > 0;
    }

    async actorExists(actorId) {
        const query = 'SELECT 1 FROM actors WHERE id = ?';
        const [rows] = await this.#db.execute(query, [actorId]);
        return rows.length > 0;
    }

    async create(data) {
        const query = `
            INSERT INTO movie_actors (movie_id, actor_id, character_name)
            VALUES (?, ?, ?)
        `;
        const [result] = await this.#db.execute(query, [
            data.movie_id,
            data.actor_id,
            data.character_name ?? null
        ]);
        return result.insertId;
    }

    async update(id, data) {
        const fields = {
            movie_id: 'movie_id',
            actor_id: 'actor_id',
            character_name: 'character_name'
        };

        const updates = Object.entries(fields)
            .filter(([field]) => Object.hasOwn(data, field))
            .map(([field, column]) => ({ column, value: data[field] }));

        if (updates.length === 0) {
            return false;
        }

        const assignments = updates.map(({ column }) => `${column} = ?`).join(', ');
        const query = `UPDATE movie_actors SET ${assignments} WHERE id = ?`;
        const params = [...updates.map(({ value }) => value), id];

        const [result] = await this.#db.execute(query, params);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const query = 'DELETE FROM movie_actors WHERE id = ?';
        const [result] = await this.#db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}
