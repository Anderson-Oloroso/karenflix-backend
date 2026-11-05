export default class HistorialDto {
    constructor(entry = {}) {
        this.id = Number(entry.id);
        this.action = entry.action;
        this.reviewId = Number(entry.review_id);
        this.movieId = Number(entry.movie_id);
        this.createdAt = entry.created_at;
    }

    get data() {
        return {
            id: this.id,
            action: this.action,
            reviewId: this.reviewId,
            movieId: this.movieId,
            createdAt: this.createdAt
        };
    }

    static fromArray(entries = []) {
        return entries.map(entry => new HistorialDto(entry).data);
    }
}