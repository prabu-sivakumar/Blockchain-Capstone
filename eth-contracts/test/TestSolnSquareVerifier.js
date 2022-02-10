var SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
var Verifier = artifacts.require('./Verifier.sol');

const zokratesProof = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];

    const tokenId = 1;

    beforeEach(async () => {
        let verifierContract = await Verifier.new({ from: account1 });
        this.contract = await SolnSquareVerifier.new(verifierContract.address, { from: account1 });
    });

    it("Should be able add a new Solution", async () => {
        let result = false;
        try {
            await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.inputs, account_two, tokenId, { from: account_two });
            result = true;
        } catch (e) {
            console.log(e);
            result = false;
        }
        assert.equal(result, true);
    });


    it("Should be able to mint new ERC721 Token", async () => {
        let minted = false;
        try {
            await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.inputs, account_two, tokenId, { from: account_two });
            await this.contract.mint(account2, tokenId, { from: account_one });
            result = true
        } catch (e) {
            console.log(e);
            minted = false;
        }
        assert.equal(minted, true);
    })
});