var SquareVerifier = artifacts.require('SquareVerifier');

const zokratesProof = require("../../zokrates/code/square/proof.json");

contract('TestSquareVerifier', accounts => {
    const owner = accounts[0];

    beforeEach(async () => {
        this.contract = await SquareVerifier.new({ from: owner });
    });

    it("should verify proof and return true", async () => {
        let result = await this.contract.verifyTx.call(...Object.values(zokratesProof.proof), zokratesProof.inputs);
        assert.equal(result, true)
    });

    it("should verify with incorrect proof and return false", async () => {
        let result = await this.contract.verifyTx.call(...Object.values(zokratesProof.proof), [10, 20]);
        assert.equal(result, false);
    });
});