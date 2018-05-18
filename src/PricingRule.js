class PricingRule{
    constructor(productListIds, ruleType, properties){
        this.productListIds = productListIds;
        this.ruleType = ruleType;
        this.properties = properties;
    }

    toString(){
        return `Pricing rule of type ${this.ruleType}`;
    }

    hasProductId(id){
        return this.productListIds.find(id);
    }
}



