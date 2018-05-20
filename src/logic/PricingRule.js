/**
 * Class representing a Pricing Rule
 */
class PricingRule {
    /**
     * Create a Pricing Rule.
     * @param {array} productListIds - List of product ids covered by the rule.
     * @param {number} ruleType - Pricing rule type.
     * @param {object} properties - Pricing rule attributes.
     */
    constructor(productListIds, ruleType, properties) {
        this.productListIds = productListIds;
        this.ruleType = ruleType;
        this.properties = properties;
    }

    toString() {
        return `Pricing rule of type ${this.ruleType}`;
    }

    /**
     * Checks if product @id is covered by this pricing rule
     * @param {string} id Id of the product
     */
    hasProductId(id) {
        if(!id){
            throw new Error("On hasProductId: param souldn\'t be null!");
        }

        return this.productListIds.indexOf(id);
    }
}

module.exports = {
    PricingRule,
}