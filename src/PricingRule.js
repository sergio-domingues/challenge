class PricingRule{
    constructor(productId, ruleType, properties){
        this.productId = productId;
        this.ruleType = ruleType;
        this.properties = properties;
    }

    toString(){
        return `Pricing rule of type ${this.ruleType} for product ${this.productId}`;
    }
}



