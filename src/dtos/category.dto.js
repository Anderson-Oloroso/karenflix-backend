export default class CategoryDTO {
    #id;
    #name;
    #description;
    #createdAt;

    constructor(category = {}) {
        this.#id = category.id;
        this.#name = category.name;
        this.#description = category.description;
        this.#createdAt = category.created_at || category.createdAt || null;
    }

    get data() {
        return {
            id: this.#id,
            name: this.#name,
            description: this.#description,
            ...(this.#createdAt && { createdAt: this.#createdAt })
        };
    }

    static fromArray(rows = []) {
        return rows.map(category => new CategoryDTO(category).data);
    }
}
