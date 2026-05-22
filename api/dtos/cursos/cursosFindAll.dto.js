export default class CursosFindAllDTO {
    constructor(limit, offset, filter, order) {
        this.limit = limit;
        this.offset = offset;
        this.filter = filter;
        this.order = order;
    }
} 