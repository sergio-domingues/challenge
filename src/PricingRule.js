class PricingRule{
    constructor(productId, ruleType){
        this.productId = productId;
        this.ruleType = ruleType;
    }

    toString(){
        return `Pricing rule of type ${this.ruleType} for product ${this.productId}`;
    }
}



