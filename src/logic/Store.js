const fs = require('fs');
const path = require('path');
const rootDir = require('app-root-dir').get();

const Product = require(path.join(rootDir, '/src/logic', 'Product.js')).Product;
const PricingRule = require(path.join(rootDir, '/src/logic', 'PricingRule.js')).PricingRule;
const CheckoutSystem = require(path.join(rootDir, '/src/logic', 'CheckoutSystem.js')).CheckoutSystem;


const RULES_PATH = path.join(rootDir, 'res', 'rules.json');
const PRODUCTS_PATH = path.join(rootDir, 'res', 'products.json');


const RULE_TYPES = {
    BULK_DISCOUNT: "bulkDiscount",
    BUY_X_GET_Y: "buyOneGetOneFree"
}

/**
 * Class representing a store
 */
class Store {
    /**
     * Creates a Store
     * @param {string} rules Pricing rules file path
     * @param {*} products Products file path
     */
    constructor(rules = RULES_PATH, products = PRODUCTS_PATH) { // Default value     
        this.pricingRules = this.getPricingRules(rules);
        this.productList = this.getProductList(products);
        this.checkoutSystem = new CheckoutSystem(); // assumes that there is only 1 checkout sys instance per store
    }

    /**
     * Empties checkout cart.
     */
    reset() {
        this.checkoutSystem.emptyCart();
    }

    /**
     * Parses pricing rules file 
     * @param {string} filePath 
     */
    getPricingRules(filePath) {
        let json = null;
        let rules = [];

        try {
            json = JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            console.log(e);
        }


        for (let i = 0; i < json.pricingRules.length; i++) {
            rules.push(
                new PricingRule(
                    json.pricingRules[i].products,
                    json.pricingRules[i].type,
                    json.pricingRules[i].properties
                ))
        }

        return rules;
    }

     /**
     * Parses products file 
     * @param {string} filePath 
     */
    getProductList(filePath) {
        let json = null;
        let products = [];

        try {
            json = JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            console.log(e);
        }

        for (let i = 0; i < json.products.length; i++) {
            products.push(
                new Product(
                    json.products[i].id,
                    json.products[i].price,
                ))
        }

        return products;
    }

    /**
     * Adds product to cart
     * @param {string} productId 
     */
    addToCart(productId) {
        if (!productId) {
            throw new Error('on addToCart: productId shoudln\'t be null');
        }

        let product = this.productList.find((element) => element.id == productId);

        if (!product) {
            return false; // product id doesnt exist in product list          
        } else {
            this.checkoutSystem.scanProduct(product);
            return true;
        }
    }

    checkout() {
        return this.checkoutSystem.checkout(this.pricingRules, RULE_TYPES);
    }

    getCartInfo() {
        return this.checkoutSystem.toString();
    }
}



/**
 *  Auxiliar methods 
 */

readFile = (filePath) => {
    if (!filePath) {
        throw new Error('On readFile: File path should not be null!');
    }

    let json = null;

    // read file from @filePath in json format
    fs.readFileSync(filePath, (err, data) => {
        if (err) {
            throw new Error(e);
        } else {
            try {
                json = JSON.parse(data);
            } catch (e) {
                console.log('Error while trying to parse data in JSON format.');
            }
        }
    });

    return json;
}

module.exports = {
    Store,
}