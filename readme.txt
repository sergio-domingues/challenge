Requirements:
    - Having a node.js version >= 8.10.0.

In order to run the program, enter the root directory and execute the following commands:

1.  Run 'npm i' or 'npm install' in order to install all necessary modules and dependencies.
2.  Start the command line interface (cli) as in the program by running 'npm start'.
3.  Follow the cli instructions.

=>  You can execute the tests by running 'npm test', they lie inside the ./test/ dir


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
 *  - User can add more products by extending the existing product list in the example "products.json" 
 *  - User can add pricing rules by extending the existing pricing rules in the example "rules.json", but should keep the object structure, i.e. dont add/delete properties
 *  - The contents of "rules.json" is not verified: 
 *      - you can get weird checkout values (i.e. negative values, etc):
 *          ex: If you supply a bulkDiscount rule with a discount > product price
 *          ex: If you supply negative params 
 */