const fs = require('fs');
const _ = require('underscore');
const path = require('path');

const Product = require('./Product.js');
const PricingRule = require('./PricingRule.js');


const PricingRulesPath = path.join(_dirname, 'res', 'rules.json');

const RULE_TYPES = {
    BULK_DISCOUNT: "bulkDiscount",
    BUY_X_GET_Y: "buyXGetY"
}


class Store {
    constructor(products, checkout) {
        if (!(products && checkout)) {
            throw new Error('On Store constructor: params should not be null!');
        }

        this.pricingRules = getPricingRules(PricingRulesPath);
        this.productList = products;
        this.checkoutSystem = checkout; // assumes that there is only 1 checkout sys instance per store
    }

    getPricingRules = (filePath) => {
        const json = readFile(PricingRulesPath);
        let rules = [];

        for (rule in json) { // todo finish this
            // this.rules.push(new PricingRule())
        }
    }

    checkout = () => {
        return this.checkoutSystem.checkout();
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

    checkout = (pricingRules) => {
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

    applyPricingRules = (pricingRules, buckets) => {
        if (!(pricingRules && buckets)) {
            throw new Error('On applyPricingRules: params should not be null!');
        }

        if (buckets.length == 0) {
            throw new Error('On applyPricingRules: empty cart');
        }

        let totalAmmount = 0;

        for (let bucket in buckets) {
            totalAmmount = handlePricingRule(pricingRules, bucket);
        }

        return totalAmmount;
    }

    handlePricingRule = (pricingRules, bucket) => {
        if (!(pricingRules && bucket)) {
            throw new Error('On handlePricingRule: params should not be null!');
        }

        if (bucket.length == 0) {
            throw new Error('On handlePricingRule: bucket length should not be null');
        }

        const rule = getRule(pricingRules, bucket[0].id);

        const handlers = {
            [RULE_TYPES.BULK_DISCOUNT]: handleBulkRule(rule.properties, bucket),
            [RULE_TYPES.BUY_X_GET_Y]: handleBuyXGetYRule(rule.properties, bucket),
            ["default"]: () => {
                handleDefaultRule();  // just returns the raw price sum of the products
            }
        }

        return handlers(handlers[rule.ruleType] || handlers.default)();
    }

    getRule = (rules, productId) => {
        for (let rule in rules) {
            if (rule.productId == productId)
                return rule;
        }

        return null;
    }

    handleBulkRule = (properties, bucket) => {
        let ammount = 0;

        for (let item in bucket) {

        }

        return ammount;
    }

    handleBuyXGetYRule = (properties, bucket) => {
        let ammount = 0;

        for (let item in bucket) {

        }

        return ammount;
    }

}

// ?=================================================================
// auxiliar methods

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