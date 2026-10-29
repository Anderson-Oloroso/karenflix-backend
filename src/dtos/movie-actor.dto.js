export default class MovieActorDTO {
    #id;
    #movie_id;
    #actor_id;
    #character_name;
    #movie;
    #actor;

    constructor(movieActor = {}) {
        this.#id = movieActor.id;
        this.#movie_id = movieActor.movie_id ?? movieActor.movieId;
        this.#actor_id = movieActor.actor_id ?? movieActor.actorId;
        this.#character_name = movieActor.character_name ?? movieActor.characterName ?? null;
        this.#movie = movieActor.movie_title ? {
            id: this.#movie_id,
            title: movieActor.movie_title,
            description: movieActor.movie_description,
            imageUrl: movieActor.movie_image_url,
            releaseYear: movieActor.release_year
        } : null;
        this.#actor = movieActor.actor_name ? {
            id: this.#actor_id,
            name: movieActor.actor_name,
            photoUrl: movieActor.actor_photo_url
        } : null;
    }

    get data() {
        return {
            id: this.#id,
            movie_id: this.#movie_id,
            actor_id: this.#actor_id,
            character_name: this.#character_name,
            ...(this.#movie && { movie: this.#movie }),
            ...(this.#actor && { actor: this.#actor })
        };
    }

    static fromArray(rows = []) {
        return rows.map(item => new MovieActorDTO(item).data);
    }
}
