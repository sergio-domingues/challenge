const _ = require('underscore');

/**
 * Class representing a Checkout System
 */
class CheckoutSystem {
    /**
     * Create a product
     */
    constructor() {
        this.cart = [];
    }

    toString() {
        if (this.cart.length == 0)
            return '<empty>';
        else
            return this.cart.toString();
    }

    /**
     * Reassigns cart with a empty one
     */
    emptyCart() {
        this.cart = [];
    }

    /**
     * Adds @item to cart
     * @param {string} item Product id
     */
    scanProduct(item) {
        if (item) { // adds product to cart
            this.cart.push(item);
        } else {
            throw new Error('On scanProduct: Item should not be null!');
        }
    }

    /**
     * Generates the checkout value applying the pricing rules to the cart items 
     * @param {Array} pricingRules List of the existing pricing rules
     * @param {Object} ruleTypes List of the existing rule types 
     * @return {number} The checkout ammount
     */
    checkout(pricingRules, ruleTypes) {
        if (!pricingRules) {
            throw new Error('On checkout: Pricing rules should not be null!');
        }

        if (this.cart.length == 0)
            return 0;

        this.ruleTypes = ruleTypes;
        let checkoutValue = null;
        let splitted = null;

        // split products into buckets of products with the same id
        splitted = _.groupBy(this.cart, (element) => element.id, 'id'); // todo test if this works

        checkoutValue = this.applyPricingRules(pricingRules, Object.values(splitted));

        return checkoutValue;
    }

    /**
     * Applies pricing rules to the cart items
     * @param {array} pricingRules List of the existing pricing rules
     * @param {array} buckets List of buckets with products
     */
    applyPricingRules(pricingRules, buckets) {
        if (!(pricingRules && buckets)) {
            throw new Error('On applyPricingRules: params should not be null!');
        }

        if (buckets.length == 0) {
            throw new Error('On applyPricingRules: empty cart');
        }

        let totalAmmount = 0;

        for (let i = 0; i < buckets.length; i++) {
            totalAmmount += this.handlePricingRule(pricingRules, buckets[i]);
        }

        return totalAmmount;
    }

    /**
     * Handles pricing rule for each product
     * @param {array} pricingRules 
     * @param {arary} bucket 
     */
    handlePricingRule(pricingRules, bucket) {
        if (!(pricingRules && bucket)) {
            throw new Error('On handlePricingRule: params should not be null!');
        }

        if (bucket.length == 0) {
            throw new Error('On handlePricingRule: bucket length should not be null');
        }

        const rule = this.getRule(pricingRules, bucket[0].id);
        const processedBucket = bucket.map((element) => element.id);

        const handlers = {
            [this.ruleTypes.BULK_DISCOUNT]: () => {
                return this.handleBulkDiscountRule(rule.properties, bucket);
            },
            [this.ruleTypes.BUY_X_GET_Y]: () => {
                return this.handleBuyXGetYRule(rule.properties, bucket);
            },
            ["default"]: () => {
                return this.handleDefaultRule(bucket); // just returns the raw sum of the products' price
            }
        }

        return rule == null ? (handlers['default'])() : (handlers[rule.ruleType])();
    }

    /**
     * Get's the rule linked to @productId
     * @param {array} rules List of rules
     * @param {string} productId Product's id
     * @return Returns the rule if exists, null otherwise
     */
    getRule(rules, productId) {
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].hasProductId(productId) >= 0)
                return rules[i];
        }

        return null;
    }


    /**
     * HANDLERS
     */

    /**
     * Applies the bulk dicount rule
     * @param {Object} properties Rule attributes
     * @param {array} bucket List of products
     */
    handleBulkDiscountRule(properties, bucket) {
        const itemLength = bucket.length;
        const threshold = properties.threshold; // product ammount threshold to apply discount
        const discountValue = properties.discountPerItem;

        let sum = 0;
        const applyDiscount = itemLength >= threshold ? itemLength : 0;

        // sum = total - (itemLength/threshold) * discountValue
        sum = getBucketTotal(bucket) - applyDiscount * discountValue;

        return sum;
    }

    /**
     * Applies the Buy X Get Y rule 
     * @param {Object} properties Rule attributes
     * @param {array} bucket List of products
     */
    handleBuyXGetYRule(properties, bucket) {
        const itemLength = bucket.length;
        const threshold = properties.productAmmount; // product ammount threshold to receive free items
        const freeItemAmmount = properties.freeAmmount;

        let sum = 0;
        let numOffers = Math.floor((itemLength / threshold));

        sum = getBucketTotal(bucket) - (numOffers * freeItemAmmount * bucket[0].price);

        return precisionRound(sum, 2);
    }

    // Returns raw sum of all item prices without any kind of processment
    handleDefaultRule(bucket) {
        return getBucketTotal(bucket);
    }

}

/**
 * Sums all bucket's products price
 * @param {array} bucket 
 */
function getBucketTotal(bucket) {
    let acc = 0;

    for (let i = 0; i < bucket.length; i++) {
        acc += bucket[i].price;
    }
    return acc;
}

/**
 * Return @number with @precision decimal places
 * @param {number} number 
 * @param {number} precision 
 */
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}


module.exports = {
    CheckoutSystem,
}