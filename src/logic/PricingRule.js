class PricingRule {
    constructor(productListIds, ruleType, properties) {
        this.productListIds = productListIds;
        this.ruleType = ruleType;
        this.properties = properties;
    }

    toString() {
        return `Pricing rule of type ${this.ruleType}`;
    }

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