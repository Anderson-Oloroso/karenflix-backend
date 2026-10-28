export default class ActorDTO {
    #id;
    #name;
    #biography;
    #birth_date;
    #photo_url;
    #createdAt;

    constructor(actor = {}) {
        this.#id = actor.id;
        this.#name = actor.name;
        this.#biography = actor.biography;
        this.#birth_date = actor.birth_date;
        this.#photo_url = actor.photo_url;
        this.#createdAt = actor.created_at || actor.createdAt || null;
    }

    get data() {
        return {
            id: this.#id,
            name: this.#name,
            biography: this.#biography,
            birth_date: this.#birth_date,
            photo_url: this.#photo_url,
            ...(this.#createdAt && { createdAt: this.#createdAt })
        };
    }

    static fromArray(rows = []) {
        return rows.map(actor => new ActorDTO(actor).data);
    }
}
