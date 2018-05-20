/**
 * Class representing a product
 */
class Product {
    /**
     * Create a Product.
     * @param {string} id - Product's id.
     * @param {number} price - Product's price.
     */
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