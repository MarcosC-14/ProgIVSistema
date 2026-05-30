export default class InscripcionesFindAllDTO {
    constructor(filter,limit,offset,order) {
        this.filter = filter;
        this.limit = limit;
        this.offset = offset;
        this.order = order;
    }
}