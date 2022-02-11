const Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

const contractFile = require('./build/contracts/SolnSquareVerifier');
const config = require('./config.json');

const args = process.argv.slice(2);
console.log(args[0]);
const tokenId = args[0];

(async () => {
    const provider = await new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4db5346c3f2e45f4b7d3feee19595f83", 0);
    const web3 = await new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const contract = await new web3.eth.Contract(contractFile.abi, config.SolnSquareVerifier, { gasLimit: "4500000" });

    console.log(`Total Supply before minting tokens ${(await contract.methods.totalSupply().call()).toString()}`);
    console.log(`Minting Token:\n Token Id: ${tokenId}\n Address: ${accounts[0]}`);

    try {
        let result = await contract.methods.mint(accounts[0], tokenId).send({ from: accounts[0], gas: 2500000});
        console.log(result)
    } catch (err) {
        throw (err);
    }
    console.log(`Total Supply after minting tokens ${(await contract.methods.totalSupply().call()).toString()}`);
    process.exit(1);
    process.kill(process.pid);
})();