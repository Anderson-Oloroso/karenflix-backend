export default class CategoryDTO {
    #id;
    #name;
    #description;

    constructor(category = {}) {
        this.#id = category.id;
        this.#name = category.name;
        this.#description = category.description;
    }

    get data() {
        return {
            id: this.#id,
            name: this.#name,
            description: this.#description
        };
    }

    static fromArray(rows = []) {
        return rows.map(category => new CategoryDTO(category).data);
    }
}