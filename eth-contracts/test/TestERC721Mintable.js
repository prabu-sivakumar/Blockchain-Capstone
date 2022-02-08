var PrabuERC721Token = artifacts.require('PrabuERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const token_supply_one = 10;
    const token_supply_two = 20;

    const name = "Prabu Varadharajalu Sivakumar";
    const symbol = "SP";


    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await this.contract.new(name, symbol, { from: account_one });
            for (let i = 0; i < token_supply_one; i++) {
                await this.contract.mint(account_one, i, { from: account_one });
            }

            for (let i = 0; i < token_supply_two; i++) {
                await this.contract.mint(account_two, i, { from: account_one });
            }
        })

        it('should return total supply', async function () {
            let result = await this.contract.totalSupply.call();
            assert.equal(30, result);
        })

        it('should get token balance', async function () {
            let result = await this.contract.balanceOf(account_one);
            assert.equal(token_supply_one, result);

            result = await this.contract.balanceOf(account_two);
            assert.equal(token_supply_two, result);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let result = await this.contract.tokenURI(1);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", result);
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_two, account_one, (token_supply_two - 1), { from: account2 });
            let result = await this.contract.ownerOf((token_supply_two - 1));
            assert.equal(account_one, result);

            result = await this.contract.balanceOf(account_one);
            assert.equal(token_supply_one + 1, result);

            result = await this.contract.balanceOf(account2);
            assert.equal(token_supply_two - 1, result);

            result = await this.contract.totalSupply.call();
            assert.equal(30, result);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await PrabuERC721Token.new({ from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {
            try {
                await this.contract.mint(account_two, 1, { from: account_two });
            } catch (err) {
                assert.equal(err.reason, "Caller must be the Contract Owner.");
            }
        })

        it('should return contract owner', async function () {
            let result = await this.contract.owner();
            assert.equal(account_one, result);
        })

    });
})
