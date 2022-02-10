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