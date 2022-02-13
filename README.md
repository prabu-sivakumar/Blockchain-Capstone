# Real Estate Marketplace
## Introduction
This is the Capstone project for the Blockchain Developer Nanodegree programme. The Project requires implementing Custom ERC721 to mint tokens to represent the title of the properties listed in the Real Estate Marketplace. The owner needs to verify the ownership of the property. A zk-SNARKS (Zokrates) is used to build a verification system to prove the ownership of title to the property without revealing the specific information on the property. Once the token is verified, it will be placed on the Open Sea Marketplace for others to purchase. 

## Setup
1. Clone the Repository 
```
git clone https://github.com/prabu-sivakumar/Blockchain-Capstone.git
```
2. Import the Project to Visual Studio IDE (or any other IDE of your choice). 
3. Smart Contracts are available under ```eth-contracts\contracts``` folder.
4. Complete the Smart Contract ```ERC721Mintable.sol```
5. The class diagram is available under:
![UML Class Diagram](https://github.com/prabu-sivakumar/Blockchain-Capstone/blob/master/Documents/ERC721Mintable.png)
6. Complete the test cases available under ```eth-contracts/test/TestERC721Mintable.js``` 
7. Compile and Run test using ```truffle test```

## Zokrates Installation
Install Zokrates using the cURL command as,
```
curl -LSfs get.zokrat.es | sh
```
Create root.zok file as,
```zok
def main(private field a, field b):
	assert(a * a == b)
return
```
Compile the Program 
```sh
zokrates compile -i root.zok
```
Perform the setup phase as,
```
zokrates compile -i root.zok
```
Execute the program
```
zokrates compute-witness -a 337 113569
```
Generate the Proof of computation
```
zokrates generate-proof
```
Export the Solidity Verifier
```
zokrates export-verifier
```
Verify natively,
```
zokrates verify
```
The generated verifier.sol file includes the verifyTx method:
```javascript
function verifyTx(
Proof memory proof, uint[1] memory input
) public view returns (bool r) {
	uint[] memory inputValues = new uint[](1);
	for(uint i = 0; i < input.length; i++){
		inputValues[i] = input[i];
	}
	if (verify(inputValues, proof) == 0) {
		return true;
	} else {
		return false;
	}
}
```
The method signature has been modified as stated in the Project documentation:
```Javascript
function verifyTx(
	uint256[2] memory a,
	uint256[2][2] memory b,
	uint256[2] memory c,
	uint256[2] memory input
) public view returns (bool r) {
	Proof memory proof;
	proof.a = Pairing.G1Point(a[0], a[1]);
	proof.b = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
	proof.c = Pairing.G1Point(c[0], c[1]);
	uint256[] memory inputValues = new uint256[](2);
	for (uint256 i = 0; i < input.length; i++) {
		inputValues[i] = input[i];
	}
	if (verify(inputValues, proof) == 0) {
		return true;
	} else {
		return false;
	}
}
```
## Square.code
Complete the square.code snippet available under ```zokrates/code/sqaure/square.code```
```python
def main(private field a, field b) -> (field):
	field result = if a * a == b then 1 else 0 fi
return result
```
**Note**: The Zokrates code can be generated either as a .zok file or .code file. The generated proof.json (Generated as part of the step to generate proof of computation) is saved to ```zokrates/code/sqaure/proof.json```

## SquareVerifier.sol
The generated Verifier.sol file is renamed to SquareVerifier.sol and added to ```/eth-contracts/contracts/SquareVerifier.sol```. 

## SolnSquareVerifier.sol
The Solution Square Verifier is a custom implementation of ```PrabuERC721Token``` that calls the Zokrates generated Solidity Verifier to submit solution and mint new tokens. 

## UML Diagram 
The UML diagram for the completed solution is attached here:
![SolnSquareVerifier UML Design](https://github.com/prabu-sivakumar/Blockchain-Capstone/blob/master/Documents/Solution%20Square%20Verifier.png)

## Deployment 
Modify the ```/eth-contracts/migrations/2_deploy_contracts.js``` to compile and migrate the smart contracts. This is to ensure the required contracts are compiled and deployed in order. ```PrabuERC721Token.sol``` should be deployed before ```SquareVerifier.sol``` and ```SolnSquareVerifier.sol``` should be the last contract deployed. 

```Javascript
// migrating the appropriate contracts

var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var PrabuERC721Token = artifacts.require("./PrabuERC721Token.sol");

module.exports = async function(deployer) {
	await deployer.deploy(PrabuERC721Token);
	const mintableToken = await PrabuERC721Token.deployed();

	await deployer.deploy(SquareVerifier);	
	const verifierContract = await SquareVerifier.deployed();
	
	await deployer.deploy(SolnSquareVerifier, verifierContract.address);
	const solnSquareVerifier = await SolnSquareVerifier.deployed();

};
```

## Test Case Execution
Complete test cases in the ```TestSolnSquareVerifier.js``` and ```TestSquareVerifier.js```
**Note**: The complete Test Case Execution logs are available under https://github.com/prabu-sivakumar/Blockchain-Capstone/blob/master/Documents/Logs/Execution_Logs.docx
```javascript
PS C:\Blockchain\Ethereum\Blockchain-Capstone\eth-contracts> truffle test

Using network 'development'.

Compiling your contracts...

===========================

√ Fetching solc version list from solc-bin. Attempt #1

√ Fetching solc version list from solc-bin. Attempt #1

> Compiling .\contracts\ERC721Mintable.sol

> Compiling .\contracts\ERC721Mintable.sol

> Compiling .\contracts\Migrations.sol

> Compiling .\contracts\Oraclize.sol

> Compiling .\contracts\SolnSquareVerifier.sol

> Compiling .\contracts\SolnSquareVerifier.sol

> Compiling .\contracts\SquareVerifier.sol

> Compiling .\contracts\SquareVerifier.sol

> Compilation warnings encountered:

project:/contracts/Oraclize.sol:320:7: Warning: Unreachable code.

_networkID; // silence the warning and remain backwards compatible

^--------^

,project:/contracts/Oraclize.sol:373:7: Warning: Unreachable code.

_myid; _result; _proof; // Silence compiler warnings

^--------------------^

,project:/contracts/Oraclize.sol:371:5: Warning: Function state mutability can be restricted to pure

function __callback(bytes32 _myid, string memory _result, bytes memory _proof) public {

^ (Relevant source part starts here and spans across multiple lines).

> Artifacts written to C:\Users\prabu\AppData\Local\Temp\test--24428-iF6s53u2KMYR

> Compiled successfully using:

- solc: 0.5.17+commit.d19bba13.Emscripten.clang

Contract: TestERC721Mintable

match erc721 spec

√ should return total supply (161ms)

√ should get token balance (199ms)

√ should return token uri (83ms)

√ should transfer token from one owner to another (1753ms)

have ownership properties

√ should fail when minting when address is not contract owner (585ms)

√ should return contract owner (167ms)

Contract: TestSolnSquareVerifier

√ Should be able add a new Solution (2685ms)

√ Should be able to mint new ERC721 Token (3490ms)

Contract: TestSquareVerifier

√ should verify proof and return true (658ms)

√ should verify with incorrect proof and return false (638ms)

10 passing (30s)
```
## Truffle Configuration to deploy Smart Contracts on Rinkeby Network

The mnemonic required to initialise the HD Wallet Provider is included in the ```.secret``` file. 

```javascript
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
	compilers: {
		solc: {
			version: "^0.5.0"
		}
	}
};
```
## Deployment
Run the following command to deploy the smart contracts on Rinkeby Network:
``` 
truffle migrate --network rinkeby --reset
```
## Contract Address
|Contract|Address  |
|--|--|
|PrabuERC721Token  |0x3d1Bac051E02D2a9D4839b348f97077C6547cf31  |
|SquareVerifier  |0xdf47ea5D5FAb69C3Bd91e47433fe02851B2d5BbC  |
|SolnSquareVerifier  | 0x5DC486056EFeDE63725395bC27b50F3d9c0844C9|

**Note**: The deployment logs are included under https://github.com/prabu-sivakumar/Blockchain-Capstone/blob/master/Documents/Logs/Deployment_Logs.docx 

## Open Sea 
Open Sea is a decentralised marketplace that is used for selling crypto assets and other digital assets that are powered by Ethereum. On OpenSea, you can buy or sell any of these items through a smart contract, meaning that no central authority ever holds custody of your items. 
Access the Open Sea Testnet Page:
https://testnets.opensea.io/

Search for the Contract Address deployed in the Rinkeby Network:
```0x5DC486056EFeDE63725395bC27b50F3d9c0844C9```

https://testnets.opensea.io/collection/prabu-varadharajalu-sivakumar 

List new item and add additional properties such as color, price, square feet and thumbnail image of the property. 
https://testnets.opensea.io/assets/0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656/92782965734790754740279798486952106329274264575976791090646549914764695306241 

We could sell items by clicking on the sell button. This initiates a series of Metamask transactions - Initialize Wallet, Approve the item for listing and confirm the items for listing. 
Once the item is listed, we could lower price. 

Login to the Metamask using another account and ensure the Wallet is sufficiently funded to buy item listed in the listing. 

Screenshots are included in the document:
https://github.com/prabu-sivakumar/Blockchain-Capstone/blob/master/Documents/Open%20Sea%20Marketplace.docx