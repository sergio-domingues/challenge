Having a node.js version >= 8.10.0.

In order to run the program, encontrando-se na raíz do directório, execute os seguintes passos:

1.  Executar o script build.sh: sh run.sh
2.  Interagir com a interface

/**
 *   
 * Assumptions:
 *  - assumes single cart per checkout sys instance
 *  - assumes single rule per productId. If more than one rule is provided, the first rule is the one applied
 *  - assumes that a pricing rule for ProductId X only influences products with ProductId X
 *      ex: You shouldn't supply a rule of type "buyOneGetOneFree" stating that buying productId X gets productId Y for free
 *      ex: You shouldn't supply a rule of type "buyOneGetOneFree" stating that property freeAmmount is greater than the property productAmmount threshold to apply free offers
 *           i.e. rule for productId X : {productAmmount : 5, freeAmmount: 10}
 * 
 * Misc:
 *  - User can add pricing rules replicating the existing pricing rules in the example "rules.json", but should keep the object structure, i.e. dont add/delete properties
 *  - The contents of "rules.json" is not verified: 
 *      - you can get weird checkout values (i.e. negative values, etc):
 *          ex: If you supply a bulkDiscount rule with a discount > product price
 *          ex: If you supply negative params 
 */