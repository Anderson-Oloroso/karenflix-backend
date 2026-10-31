export default class DirectorDTO {
    #id;
    #name;
    #biography;
    #photoUrl;
    #createdAt;
    #movies;

    constructor(director = {}) {
        this.#id = director.id;
        this.#name = director.name;
        this.#biography = director.biography ?? null;
        this.#photoUrl = director.photo_url ?? director.photoUrl ?? null;
        this.#createdAt = director.created_at ?? director.createdAt ?? null;
        this.#movies = director.movies;
    }

    get data() {
        return {
            id: this.#id,
            name: this.#name,
            biography: this.#biography,
            photo_url: this.#photoUrl,
            ...(this.#createdAt && { createdAt: this.#createdAt }),
            ...(this.#movies && { movies: this.#movies })
        };
    }

    static fromArray(rows = []) {
        return rows.map(director => new DirectorDTO(director).data);
    }
}