export default class DirectorDTO {
    #id;
    #name;
    #createdAt;
    #movies;

    constructor(director = {}) {
        this.#id = director.id;
        this.#name = director.name;
        this.#createdAt = director.created_at ?? director.createdAt ?? null;
        this.#movies = director.movies;
    }

    get data() {
        return {
            id: this.#id,
            name: this.#name,
            ...(this.#createdAt && { createdAt: this.#createdAt }),
            ...(this.#movies && { movies: this.#movies })
        };
    }

    static fromArray(rows = []) {
        return rows.map(director => new DirectorDTO(director).data);
    }
}