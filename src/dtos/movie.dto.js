export default class MoviesDTO {

    #id;
    #title;
    #description;
    #category;
    #releaseYear;
    #imageUrl;
    #status;
    #createBy;
    #createAt;

    constructor(movie = {}) {
        this.#id = movie.id;
        this.#title = movie.title;
        this.#description = movie.description;
        this.#category = movie.category_name || movie.category;
        this.#releaseYear = movie.release_year;
        this.#imageUrl = movie.image_url;
        this.#status = movie.status;
        this.#createBy = movie.username || movie.created_by;
        this.#createAt = movie.created_at || movie.create_at;
    }

    get data() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            category: this.#category,
            releaseYear: this.#releaseYear,
            imageUrl: this.#imageUrl,
            status: this.#status,
            createBy: this.#createBy,
            createAt: this.#createAt   
        };
    }

    static fromArray(rows = []) {
        return rows.map(movie => new MoviesDTO(movie).data);
    }
}
