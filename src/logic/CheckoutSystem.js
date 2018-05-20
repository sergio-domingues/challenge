const _ = require('underscore');

class CheckoutSystem {
    constructor() {
        this.cart = [];
    }

    toString() {
        if (this.cart.length == 0)
            return '<empty>';
        else
            return this.cart.toString();
    }

    emptyCart(){
        this.cart = [];
    }

    scanProduct(item) {
        if (item) { // adds product to cart
            this.cart.push(item);
        } else {
            throw new Error('On scanProduct: Item should not be null!');
        }
    }

    checkout(pricingRules, ruleTypes) {
        if (!pricingRules) {
            throw new Error('On checkout: Pricing rules should not be null!');
        }

        this.ruleTypes = ruleTypes;
        let checkoutValue = null;
        let splitted = null;

        // split products into buckets of products with the same id
        splitted = _.groupBy(this.cart, (element) => element.id, 'id'); // todo test if this works

        checkoutValue = this.applyPricingRules(pricingRules, Object.values(splitted));

        return checkoutValue;
    }

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
                return this.handleDefaultRule(bucket); // just returns the raw price sum of the products price
            }
        }

        return (handlers[rule.ruleType] || handlers['default'])(); // default in case rule == null
    }

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

    handleBuyXGetYRule(properties, bucket) {
        const itemLength = bucket.length;
        const threshold = properties.productAmmount; // product ammount threshold to receive free items
        const freeItemAmmount = properties.freeAmmount;

        let sum = 0;
        const numOffers = Math.round(Math.floor((itemLength / threshold) / 2) , 2);

        sum = getBucketTotal(bucket) - (numOffers * freeItemAmmount * bucket[0].price);

        return sum;
    }

    // Returns raw sum of all item prices without any kind of processment
    handleDefaultRule(bucket) {
        return getBucketTotal(bucket);
    }

}

function getBucketTotal(bucket) {
    let acc = 0;

    for (let i = 0; i < bucket.length; i++) {
        acc += bucket[i].price;
    }
    return acc;
}


module.exports = {
    CheckoutSystem,
}