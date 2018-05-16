class PricingRule{
    constructor(productId, ruleType){
        this.productId = productId;
        this.ruleType = ruleType;
    }

    applyPricingRule(productList){ // assumes only 1 pricing rule per product type
         
    }

    toString(){
        return `Pricing rule of type ${this.ruleType} for product ${this.productId}`;
    }
}



