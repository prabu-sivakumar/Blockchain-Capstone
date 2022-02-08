var HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 9545,
            network_id: "*"
        },
        rinkeby: {
            provider: function () {
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4db5346c3f2e45f4b7d3feee19595f83");
            },
            network_id: 4,
            gas: 4500000,
            gasPrice: 10000000000,
        }
    },
    //https://trufflesuite.com/docs/truffle/reference/configuration.html 
    compilers: {
        solc: {
            version: "^0.5.0"
        }
    }
};