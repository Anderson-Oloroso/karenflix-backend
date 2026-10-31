const MOVIE_SELECT = `SELECT
    m.id,
    m.title,
    m.description,
    c.name AS category_name,
    m.release_year,
    m.image_url,
    m.status,
    m.average_rating,
    u.username,
    m.created_at
FROM movies m
INNER JOIN categories c ON c.id = m.category_id
LEFT JOIN users u ON u.id = m.created_by`;

export default class MovieModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async createMovie(movie) {
        const [result] = await this.#db.execute(
            `INSERT INTO movies (
                title,
                description,
                category_id,
                release_year,
                image_url,
                status,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                movie.title,
                movie.description,
                movie.category_id,
                movie.release_year,
                movie.image_url,
                movie.status || 'pending',
                movie.created_by
            ]
        );
        return result;
    }

    async getAll(filters = {}) {
        return this.#getPage(filters, 'approved');
    }

    async getPending(filters = {}) {
        return this.#getPage(filters, 'pending');
    }

    async getById(id) {
        const [rows] = await this.#db.execute(
            `${MOVIE_SELECT}
            WHERE m.id = ? AND m.status = 'approved'`,
            [id]
        );
        return rows[0] ?? null;
    }

    async exists(id) {
        const [rows] = await this.#db.execute(
            'SELECT id FROM movies WHERE id = ?',
            [id]
        );
        return rows.length > 0;
    }

    async categoryExists(categoryId) {
        const [rows] = await this.#db.execute(
            'SELECT id FROM categories WHERE id = ?',
            [categoryId]
        );
        return rows.length > 0;
    }

    async existTitle(title, excludeId = null) {
        let query = 'SELECT id FROM movies WHERE title = ?';
        const params = [title];
        if (excludeId !== null) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        const [rows] = await this.#db.execute(query, params);
        return rows.length > 0;
    }

    async updateMovie(id, movie) {
        const [result] = await this.#db.execute(
            `UPDATE movies
            SET
                title = COALESCE(?, title),
                description = COALESCE(?, description),
                category_id = COALESCE(?, category_id),
                release_year = COALESCE(?, release_year),
                image_url = COALESCE(?, image_url),
                status = COALESCE(?, status)
            WHERE id = ?`,
            [
                movie.title ?? null,
                movie.description ?? null,
                movie.category_id ?? null,
                movie.release_year ?? null,
                movie.image_url ?? null,
                movie.status ?? null,
                id
            ]
        );
        return result;
    }

    async approve(id) {
        const [result] = await this.#db.execute(
            "UPDATE movies SET status = 'approved' WHERE id = ?",
            [id]
        );
        return result;
    }

    async deleteMovie(id) {
        const [result] = await this.#db.execute(
            'DELETE FROM movies WHERE id = ?',
            [id]
        );
        return result;
    }

    async #getPage(filters, status) {
        const conditions = ['m.status = ?'];
        const params = [status];

        if (filters.category) {
            conditions.push('m.category_id = ?');
            params.push(filters.category);
        }
        if (filters.title) {
            conditions.push('m.title LIKE ?');
            params.push(`%${filters.title}%`);
        }

        const where = conditions.join(' AND ');
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 20;
        const offset = (page - 1) * limit;
        const [movies] = await this.#db.execute(
            `${MOVIE_SELECT}
            WHERE ${where}
            ORDER BY m.created_at DESC
            LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        const [countRows] = await this.#db.execute(
            `SELECT COUNT(*) AS total FROM movies m WHERE ${where}`,
            params
        );

        return {
            movies,
            total: Number(countRows[0].total),
            page,
            limit
        };
    }
}
