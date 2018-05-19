const path = require('path');
const rootDir = require('app-root-dir').get();
const readline = require('readline');

const store = require(path.join(rootDir, '/src/logic', 'Store.js'));
const interface = require(path.join(rootDir, '/src', 'cli.js'));

const RULES_PATH = path.join(rootDir, 'res', 'rules.json');


//let ndriveStore = new store.Store(RULES_PATH);
run = (storeObj) => {
    interface.cli(storeObj);
}

run( /*ndriveStore*/ );