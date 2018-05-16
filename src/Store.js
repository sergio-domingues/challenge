const fs = require('fs');
const _ = require('underscore');

const Product = require('./Product.js');

class Store {
    constructor(pricingRulesPath, products, checkout) {
        if (!(pricingRulesPath && products && checkout)) {
            throw new Error('On Store constructor: params should not be null!');
        }

        this.pricingRules = getPricingRules(pricingRulesPath);
        this.productList = products;
        this.checkoutSystem = checkout; // assumes that there is only 1 checkout sys instance per store
    }

    getPricingRules = (filePath) => {
        if (!filePath) {
            throw new Error('On getPricingRules: Pricing rules file path should not be null!');
        }

        let rulesInJson = null;

        // get pricing rules from @filePath in json format
        fs.readFileSync(filePath, (err, data) => {
            if (err) {
                throw new Error(e);
            } else {
                try {
                    rulesInJson = JSON.parse(data);
                } catch (e) {
                    console.log('Error while trying to parse pricing rules data in JSON format.');
                }
            }
        });

        return rulesInJson;
    }


}

class CheckoutSystem {
    constructor() {
        this.cart = []; // assumes single cart per checkout sys instance
    }

    scanProduct = (item) => {
        if (item) { // adds product to cart
            this.cart.push(item);
        } else {
            throw new Error('On scanProduct: Item should not be null!');
        }
    }

    checkout(pricingRules) {
        if (!pricingRules) {
            throw new Error('On checkout: Pricing rules should not be null!');
        }

        let checkoutValue = null;
        let splitted = null;

        // split products into buckets (arrays) of products with the same id
        _.groupBy(this.cart, 'id'); // todo test if this works


        checkoutValue = applyPricingRules(pricingRules, splitted);

        return checkoutValue;
    }

    applyPricingRules(pricingRulesHandler, buckets){

    }

}