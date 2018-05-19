const path = require('path');
const rootDir = require('app-root-dir').get();
const readline = require('readline');


// strings
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
const template = `Choose a product:`;


cli = (storeObj) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let store = storeObj;
        
    rl.question(initialMsg, (answer) => {
       const iterationMsg = `${cartMsg}${store.getCartInfo()}\n${template}`;
       rl.write(iterationMsg)
    }); 
    
    rl.on('line', (data) => {
        handleUserInteraction(rl, store, data);
    });



    rl.on('close', () => {
        // only gets triggered by ^C or ^D
        console.log('Goodbye! See you soon ^.^');
        process.exit(0);
    });



    // closeinput at the end of the chat
    //closeInput(rl);
}

closeInput = (interface) => {
    rlInterface.close();
    process.stdin.destroy();
}

handleUserInteraction = (rl, storeObj, input) => {
    const iterationMsg = `${cartMsg}${store.getCartInfo()}\n${template}`;
    switch(input){
        case 'checkout': {
            console.log(storeObj.checkout());
        }
        
        default: {
            let ret = storeObj.addToCart(input);

            if(!ret){
                rl.write('Not a valid input! Check cli instructions please.');
            }           
        }
    }
}


module.exports = {
    cli,
}