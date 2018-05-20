class Product {
    constructor(id, price) {
        this.id = id;
        this.price = price;
    }

    toString(){
        return `${this.id}`;
    }
}

module.exports = {
    Product,
}