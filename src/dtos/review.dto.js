export default class ReviewDTO {
    #id;
    #movieId;
    #user;
    #title;
    #comment;
    #rating;
    #likesCount;
    #createdAt;

    constructor(review = {}) {
        this.#id = review.id;
        this.#movieId = review.movie_id;
        this.#user = review.username ?? review.user_id;
        this.#title = review.title;
        this.#comment = review.comment;
        this.#rating = review.rating;
        this.#likesCount = Number(review.likes_count || 0);
        this.#createdAt = review.created_at;
    }

    get data() {
        return {
            id: this.#id,
            movieId: this.#movieId,
            user: this.#user,
            title: this.#title,
            comment: this.#comment,
            rating: this.#rating,
            likesCount: this.#likesCount,
            createdAt: this.#createdAt
        };
    }

    static fromArray(rows = []) {
        return rows.map(review => new ReviewDTO(review).data);
    }
}
