const fs = require('fs');
const _ = require('underscore');
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


class Store {
    constructor(rules = RULES_PATH, products = PRODUCTS_PATH) {  // Default value     
        this.pricingRules = this.getPricingRules(rules);
        this.productList = this.geProductList(products);
        this.checkoutSystem = new CheckoutSystem(); // assumes that there is only 1 checkout sys instance per store
    }

    getPricingRules(filePath) {
        const json = JSON.parse(readFile(filePath));
        let rules = [];

        for (rule in json.pricingRules) {
            rules.push(
                new PricingRule(
                    rule.products,
                    rule.ruleType,
                    rule.properties
                ))
        }

        return rules;
    }

    geProductList(filePath){
        const json = JSON.parse(readFile(filePath));
        let products = [];

        for (product in json.products) {
            products.push(
                new Product(
                    product.id,
                    product.price,
                ))
        }

        return products;
    }

    addToCart(productId) {
        if(!productId){
            throw new Error('on addToCart: productId shoudln\'t be null');
        }

        this.checkoutSystem.scanProduct(productId);
    }

    checkout() {
        return this.checkoutSystem.checkout(this.pricingRules);
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