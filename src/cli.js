const path = require('path');
const rootDir = require('app-root-dir').get();
const readline = require('readline');


// strings
const greeting = '=====  Welcome to NDrive Store! Happy shopping :-)   =====';
const instructions = `=> [CLI INSTRUCTIONS]\n- Write '1' for product one, '2' for product two and so on.\n- In order to checkout just write '0' or 'checkout'.`;
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
       rl.write(startMsg)
    }); 
    
    rl.on('line', (data) => {
        handleUserInteraction(rl, data);
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

handleUserInteraction = (rl, input) => {
    
}


module.exports = {
    cli,
}