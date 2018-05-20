const assert = require('assert');

const path = require('path');
const rootDir = require('app-root-dir').get();

const logic = path.join(rootDir, 'src/logic');
const Store = require(path.join(logic, 'Store.js')).Store;
const PricingRule = require(path.join(logic, 'PricingRule.js')).PricingRule;
const CheckoutSystem = require(path.join(logic, 'CheckoutSystem.js')).CheckoutSystem;


describe('Pricing Rule Class', () => {

    // Test Method
    describe('#hasProductId()', () => {
        it('should throw error on null param', () => {
            const mock = new PricingRule([], 'type', {});

            assert.throws(() => {
                mock.hasProductId();
            });
        });
    });
});

describe('Checkout System class', () => {
    describe('#scanProduct()', () => {
        const checkout = new CheckoutSystem();

        it('should throw error on null param', () => {

            assert.throws(() => {
                checkout.scanProduct();
            });
        });

        it('should add 1 item to empty cart', () => {
            checkout.scanProduct('item');
            assert.equal(1, checkout.cart.length);
        })

        it('cart length should be 0', () => {
            checkout.scanProduct('item');
            checkout.emptyCart();
            assert.equal(0, checkout.cart.length);
        })
    })
});

describe('Store class', () => {

    describe('# Pricing rules', () => {
        const defaultRuleProduct = 'MAP_EUR';
        const bulkRuleProduct = '3M_SP_C';
        const getFreeRuleProduct = '1M_TRAF';

        let store = new Store();

        it('should throw error on null param', () => {

            assert.throws(() => {
                checkout.scanProduct();
            });
        });

        it('should return 0 on checkout with empty cart', () => {
            assert.equal(0, store.checkout());
        })


        // runs before each tests in this block
        beforeEach(() => {
            store.reset(); // empties cart
        });


        describe('# Default Rule', () => {

            it('should match the expected checkout value for 1 item', () => {
                store.addToCart(defaultRuleProduct);
                assert.equal(11.23, store.checkout());
            });

            it('should match the expected checkout value for 5 equal items', () => {
                for (let i = 0; i < 5; i++) {
                    store.addToCart(defaultRuleProduct);
                }

                assert.equal(11.23 * 5, store.checkout());
            });
        });

        describe('# Bulk Rule', () => {

            it('should not apply bulk rule having only 1 item', () => {
                store.addToCart(bulkRuleProduct);
                assert.equal(5.00, store.checkout());
            });

            it('should apply bulk rule having 3 equal items', () => {
                for (let i = 0; i < 3; i++) {
                    store.addToCart(bulkRuleProduct);
                }

                assert.equal(4.50 * 3, store.checkout());
            });

            it('should apply bulk rule having 15 equal items', () => {
                for (let i = 0; i < 15; i++) {
                    store.addToCart(bulkRuleProduct);
                }

                assert.equal(4.50 * 15, store.checkout());
            });

        });

        describe('# Buy One Get One Free Rule', () => {

            it('should not apply rule having only 1 item', () => {
                store.addToCart(getFreeRuleProduct);
                assert.equal(3.11, store.checkout());
            });

            it('should apply free offer rule having 2 equal items', () => {
                for (let i = 0; i < 2; i++) {
                    store.addToCart(getFreeRuleProduct);
                }

                assert.equal(3.11, store.checkout());
            });

            it('should apply free offer rule having 15 equal items', () => {
                for (let i = 0; i < 15; i++) {
                    store.addToCart(getFreeRuleProduct);
                }

                const total = 3.11 * 15;
                const discount = Math.floor(15 / 2) * 3.11;
                assert.equal(total - discount, store.checkout());
            });
        });

        describe('Mixing products with different pricing rules', () => {

            it('should not apply any rule', () => {
                store.addToCart(defaultRuleProduct);
                store.addToCart(getFreeRuleProduct);
                store.addToCart(bulkRuleProduct);
                assert.equal(3.11 + 5.00 + 11.23, store.checkout());
            });

            it('should apply free offer rule only', () => {
                store.addToCart(getFreeRuleProduct);
                store.addToCart(bulkRuleProduct);                
                store.addToCart(getFreeRuleProduct);
                store.addToCart(defaultRuleProduct);               

                assert.equal(19.34, store.checkout());
            });

            it('should apply bulk discount rule only', () => {                
                store.addToCart(bulkRuleProduct);   
                store.addToCart(bulkRuleProduct);                
                store.addToCart(getFreeRuleProduct);
                store.addToCart(bulkRuleProduct); 

                assert.equal(16.61, store.checkout());
            });

            it('should apply all rules', () => {
                
                for (let i = 0; i < 5; i++) {
                    store.addToCart(bulkRuleProduct);
                    store.addToCart(getFreeRuleProduct);
                    store.addToCart(defaultRuleProduct);   
                }

                const total = (3.11 + 5.00 + 11.23) * 5;
                const bulkDiscount = 0.5 * 5;
                const offerDiscount = Math.floor(5 / 2) * 3.11;
                const discount = bulkDiscount + offerDiscount;
                
                assert.equal(total - discount, store.checkout());
            })
        });
    });

});