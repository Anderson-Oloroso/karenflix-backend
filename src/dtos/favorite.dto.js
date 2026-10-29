export default class FavoriteDTO {
    #id;
    #user_id;
    #movie_id;
    #createdAt;
    #movie;

    constructor(favorite = {}) {
        this.#id = favorite.id;
        this.#user_id = favorite.user_id;
        this.#movie_id = favorite.movie_id;
        this.#createdAt = favorite.created_at || favorite.createdAt || null;
        this.#movie = favorite.title ? {
            title: favorite.title,
            description: favorite.description,
            category: favorite.category_name,
            releaseYear: favorite.release_year,
            imageUrl: favorite.image_url,
            status: favorite.status
        } : null;
    }

    get data() {
        return {
            id: this.#id,
            user_id: this.#user_id,
            movie_id: this.#movie_id,
            ...(this.#createdAt && { createdAt: this.#createdAt }),
            ...(this.#movie && { movie: this.#movie })
        };
    }

    static fromArray(rows = []) {
        return rows.map(favorite => new FavoriteDTO(favorite).data);
    }
}
