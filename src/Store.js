const fs = require('fs');
const _ = require('underscore');
const path = require('path');

const Product = require('./Product.js');
const PricingRule = require('./PricingRule.js');


const PricingRulesPath = path.join(_dirname, 'res', 'rules.json');

const RULE_TYPES = {
    BULK_DISCOUNT: "bulkDiscount",
    BUY_X_GET_Y: "buyOneGetOneFree"
}


class Store {
    constructor(products, checkout) {
        if (!(products && checkout)) {
            throw new Error('On Store constructor: params should not be null!');
        }

        this.pricingRules = this.getPricingRules(PricingRulesPath);
        this.productList = products;
        this.checkoutSystem = checkout; // assumes that there is only 1 checkout sys instance per store
    }

    getPricingRules = (filePath) => {
        const json = readFile(PricingRulesPath);
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

    checkout = () => {
        return this.checkoutSystem.checkout(this.pricingRules);
    }
}


class CheckoutSystem {
    constructor() {
        this.cart = []; 
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
        splitted = _.groupBy(this.cart, 'id'); // todo test if this works

        checkoutValue = this.applyPricingRules(pricingRules, splitted);

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
            totalAmmount = this.handlePricingRule(pricingRules, bucket);
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

        const rule = this.getRule(pricingRules, bucket[0].id);

        const handlers = {
            [RULE_TYPES.BULK_DISCOUNT]: this.handleBulkDiscountRule(rule.properties, bucket),
            [RULE_TYPES.BUY_X_GET_Y]: this.handleBuyXGetYRule(rule.properties, bucket),
            ["default"]: () => {
                this.handleDefaultRule(); // just returns the raw price sum of the products price
            }
        }

        return handlers(handlers[rule.ruleType] || handlers.default)(); // default in case rule == null
    }

    getRule = (rules, productId) => {
        for (let rule in rules) {
            if (rule.hasProductId(productId))
                return rule;
        }

        return null;
    }

    /**
     * HANDLERS
     */

    handleBulkDiscountRule = (properties, bucket) => {        
        const itemLength = bucket.length;
        const threshold = properties.threshold; // product ammount threshold to apply discount
        const discountValue = properties.discountPerItem;
        
        let sum = 0;
        const numDiscounts = Math.floor(itemLength/threshold); // number of discount applied
        
        // sum = total - (itemLength/threshold) * discountValue
        sum = list.reduce(sumProductPrices) - numDiscounts * discountValue;

        return sum;
    }

    handleBuyXGetYRule = (properties, bucket) => {
        const itemLength = bucket.length;
        const threshold = properties.productAmmount; // product ammount threshold to receive free items
        const freeAmmount = properties.freeAmmount;  
        
        let sum = 0;
        // const numOffers = itemLength - ... ;  // todo

        sum = list.reduce(sumProductPrices);


        return sum;
    }

    // Returns raw sum of all item prices without any kind of processment
    handleDefaultRule = (bucket) => { 
        return list.reduce(sumProductPrices);
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

// sum function to be used by Array.reduce method
sumProductPrices = (total, item) => {
    return total + item.price; // return the sum of the accumulator and the current price. as the the new accumulator)
};