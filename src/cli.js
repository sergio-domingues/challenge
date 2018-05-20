const path = require('path');
const rootDir = require('app-root-dir').get();
const readline = require('readline');


// ======= strings

const greeting = '=====  Welcome to NDrive Store! Happy shopping :-)   =====';
const instructions = `=> [CLI INSTRUCTIONS]\n- Write the <Product Code> in order to add it to the cart.\n- To checkout just write 'checkout'.`;
const startMsg = `Press 'Enter' to start shopping.`;
const productTable = `This is our product list:\n
+---------------|------------------------------|---------+ 
| Product Code  |     Name                     |  Price  |
+---------------|------------------------------|---------+
|     1M_TRAF   |   Traffic Service (1 Month)  |  €3.11  |
|     3M_SP_C   |   Speed Cameras (3 Months)   |  €5.00  |
|     MAP_EUR   |   Europe Map                 | €11.23  |
+---------------|------------------------------|---------+`;

const initialMsg = `\n${greeting}\n\n${instructions}\n\n${productTable}\n\n${startMsg}`;
const cartMsg = `Shopping Cart: `;
const template = `Enter a product ID (write 'checkout' to empty your cart):`;
const newInteraction = `Your cart is now empty! You can keep shopping.`;
// =============================


closeInput = (interface) => {
    interface.close();
    process.stdin.destroy();
}

handleUserInteraction = (rl, storeObj, input) => {

    const iterationMsg = `${cartMsg}${storeObj.getCartInfo()}\n${template}`;

    switch (input) {
        case 'checkout':
            {
                return storeObj.checkout();
            }

        default:
            {
                let ret = storeObj.addToCart(input);

                if (!ret) {
                    console.log('Not a valid product id! Check product list please.\n');
                }

                return null;
            }
    }
}

// command line interface logic
cli = (storeObj) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let store = storeObj;

    // initial interaction with user
    rl.question(initialMsg, (answer) => {
        console.log(`${cartMsg}${storeObj.getCartInfo()}\n${template}`);
    });

    // on user input
    rl.on('line', (data) => {
        if (data == '' || !data)
            return;

        let val = handleUserInteraction(rl, store, data);
        let iterationMsg = `${cartMsg}${storeObj.getCartInfo()}\n${template}`;

        // a null 'val' means that user didn't enter the checkout command yet
        if (val != null) {
            console.log(`\n====> Checkout value: ${val}€`);

            store.reset(); // empty users cart

            console.log(`${newInteraction}\n`);
            console.log(`${cartMsg}${storeObj.getCartInfo()}\n${template}`);
        } else {
            console.log(iterationMsg);
        }
    });

    rl.on('close', () => {
        // only gets triggered by ^C or ^D
        console.log('Goodbye! See you soon ^.^');
        process.exit(0);
    });
}


module.exports = {
    cli,
}