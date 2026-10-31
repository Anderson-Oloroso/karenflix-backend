export default class MovieDTO {
    #id;
    #title;
    #description;
    #category;
    #directorId;
    #directorName;
    #releaseYear;
    #durationMinutes;
    #ageRating;
    #imageUrl;
    #bannerUrl;
    #trailerUrl;
    #status;
    #averageRating;
    #likesCount;
    #createBy;
    #createAt;

    constructor(movie = {}) {
        this.#id = movie.id;
        this.#title = movie.title;
        this.#description = movie.description;
        this.#category = movie.category_name || movie.category;
        this.#directorId = movie.director_id;
        this.#directorName = movie.director_name || movie.director;
        this.#releaseYear = movie.release_year;
        this.#durationMinutes = movie.duration_minutes;
        this.#ageRating = movie.age_rating;
        this.#imageUrl = movie.image_url;
        this.#bannerUrl = movie.banner_url;
        this.#trailerUrl = movie.trailer_url;
        this.#status = movie.status;
        this.#averageRating = movie.average_rating !== undefined && movie.average_rating !== null
            ? Number(movie.average_rating)
            : 0;
        this.#likesCount = Number(movie.likes_count ?? 0);
        this.#createBy = movie.username || movie.created_by;
        this.#createAt = movie.created_at || movie.create_at;
    }

    get data() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            category: this.#category,
            director: this.#directorId === undefined
                ? this.#directorName
                : { id: this.#directorId, name: this.#directorName },
            releaseYear: this.#releaseYear,
            durationMinutes: this.#durationMinutes,
            ageRating: this.#ageRating,
            imageUrl: this.#imageUrl,
            bannerUrl: this.#bannerUrl,
            trailerUrl: this.#trailerUrl,
            status: this.#status,
            averageRating: this.#averageRating,
            likesCount: this.#likesCount,
            createBy: this.#createBy,
            createAt: this.#createAt   
        };
    }

    static fromArray(rows = []) {
        return rows.map(movie => new MovieDTO(movie).data);
    }
}
