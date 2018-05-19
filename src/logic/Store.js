const fs = require('fs');
const _ = require('underscore');
const path = require('path');
const rootDir = require('app-root-dir').get();

const Product = require(path.join(rootDir, '/src/logic', 'Product.js')); 
const PricingRule = require(path.join(rootDir, '/src/logic', 'PricingRule.js'));
const checkoutSystem = require(path.join(rootDir, '/src/logic', 'CheckoutSystem.js'));


const RULES_PATH = path.join(rootDir, 'res', 'rules.json');

const RULE_TYPES = {
    BULK_DISCOUNT: "bulkDiscount",
    BUY_X_GET_Y: "buyOneGetOneFree"
}


class Store {
    constructor(rules = RULES_PATH) {  // Default value     
        this.pricingRules = this.getPricingRules(rules);
        this.productList = [];
        this.checkoutSystem = new checkoutSystem.CheckoutSystem(); // assumes that there is only 1 checkout sys instance per store
    }

    getPricingRules(filePath) {
        const json = readFile(filePath);
        let rules = [];

        for (rule in json) {
            rules.push(
                new PricingRule(
                    rule.products,
                    rule.ruleType,
                    rule.properties
                ))
        }

        return rules;
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