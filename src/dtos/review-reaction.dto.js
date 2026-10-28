export default class ReviewReactionDTO {
    #reviewId;
    #reaction;
    #likes;
    #dislikes;
    #toggledOff;

    constructor(reviewId, reaction, counts, toggledOff = false) {
        this.#reviewId = Number(reviewId);
        this.#reaction = reaction;
        this.#likes = Number(counts.likes);
        this.#dislikes = Number(counts.dislikes);
        this.#toggledOff = toggledOff;
    }

    get data() {
        return {
            reviewId: this.#reviewId,
            reaction: this.#reaction,
            counts: {
                likes: this.#likes,
                dislikes: this.#dislikes
            },
            toggledOff: this.#toggledOff
        };
    }
}
