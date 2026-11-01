const MOVIE_SELECT = `SELECT
    m.id,
    m.title,
    m.description,
    m.director_id,
    d.name AS director_name,
    m.category_id,
    c.name AS category_name,
    m.release_year,
    m.duration_minutes,
    m.age_rating,
    m.image_url,
    m.banner_url,
    m.trailer_url,
    m.status,
    m.average_rating,
    m.likes_count,
    u.username,
    m.created_by,
    m.created_at
FROM movies m
INNER JOIN categories c ON c.id = m.category_id
INNER JOIN directors d ON d.id = m.director_id
LEFT JOIN users u ON u.id = m.created_by`;

const RANKING_JOINS = `LEFT JOIN (
    SELECT
        movie_id,
        SUM(rating * POWER(0.5, GREATEST(TIMESTAMPDIFF(SECOND, created_at, CURRENT_TIMESTAMP), 0) / (180 * 86400)))
            / NULLIF(SUM(POWER(0.5, GREATEST(TIMESTAMPDIFF(SECOND, created_at, CURRENT_TIMESTAMP), 0) / (180 * 86400))), 0)
            AS weighted_rating,
        MAX(created_at) AS latest_review_at
    FROM reviews
    GROUP BY movie_id
) rating_stats ON rating_stats.movie_id = m.id
LEFT JOIN (
    SELECT
        r.movie_id,
        SUM(rr.reaction_type = 'like') AS likes,
        SUM(rr.reaction_type = 'dislike') AS dislikes
    FROM reviews r
    INNER JOIN review_reactions rr ON rr.review_id = r.id
    GROUP BY r.movie_id
) reaction_stats ON reaction_stats.movie_id = m.id`;

const RANKING_SCORE = `ROUND(
    0.70 * COALESCE(rating_stats.weighted_rating, 0)
    + 0.20 * COALESCE(
        10 * reaction_stats.likes / NULLIF(reaction_stats.likes + reaction_stats.dislikes, 0),
        0
    )
    + 0.10 * COALESCE(
        10 * POWER(
            0.5,
            GREATEST(TIMESTAMPDIFF(SECOND, rating_stats.latest_review_at, CURRENT_TIMESTAMP), 0) / (180 * 86400)
        ),
        0
    ),
    2
)`;

const MOVIE_SELECT_WITH_RANKING = MOVIE_SELECT.replace(
    '\nFROM movies m',
    `,\n    ${RANKING_SCORE} AS ranking_score\nFROM movies m`
) + `\n${RANKING_JOINS}`;

export default class MovieModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async createMovie(movie) {
        const [result] = await this.#db.execute(
            `INSERT INTO movies (
                title, description, director_id, category_id, release_year,
                duration_minutes, age_rating, image_url, banner_url, trailer_url,
                status, created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                movie.title,
                movie.description,
                movie.director_id,
                movie.category_id,
                movie.release_year,
                movie.duration_minutes,
                movie.age_rating ?? 'PG-13',
                movie.image_url,
                movie.banner_url ?? null,
                movie.trailer_url ?? null,
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

    async directorExists(directorId) {
        const [rows] = await this.#db.execute(
            'SELECT id FROM directors WHERE id = ?',
            [directorId]
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
        const fields = {
            title: 'title',
            description: 'description',
            director_id: 'director_id',
            category_id: 'category_id',
            release_year: 'release_year',
            duration_minutes: 'duration_minutes',
            age_rating: 'age_rating',
            image_url: 'image_url',
            banner_url: 'banner_url',
            trailer_url: 'trailer_url',
            status: 'status'
        };
        const updates = Object.entries(fields)
            .filter(([field]) => Object.hasOwn(movie, field))
            .map(([field, column]) => ({ column, value: movie[field] }));

        if (updates.length === 0) {
            return false;
        }

        const assignments = updates.map(({ column }) => `${column} = ?`).join(', ');
        const [result] = await this.#db.execute(
            `UPDATE movies SET ${assignments} WHERE id = ?`,
            [...updates.map(({ value }) => value), id]
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
        const orderBy = {
            recent: 'm.created_at DESC',
            popular: 'm.likes_count DESC, ranking_score DESC',
            ranking: 'ranking_score DESC, m.average_rating DESC'
        }[filters.sort] || 'm.created_at DESC';
        const [movies] = await this.#db.execute(
            `${MOVIE_SELECT_WITH_RANKING}
            WHERE ${where}
            ORDER BY ${orderBy}, m.created_at DESC
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
