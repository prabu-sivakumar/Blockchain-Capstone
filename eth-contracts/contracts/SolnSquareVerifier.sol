pragma solidity ^0.5.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";

contract SolnSquareVerifier is PrabuERC721Token {
    SquareVerifier private squareVerifier;

    constructor(address verifierAddress) public {
        squareVerifier = SquareVerifier(verifierAddress);
    }

    struct Solution {
        uint256 tokenId;
        address owner;
        uint256[2] inputs;
        bool minted;
    }

    mapping(bytes32 => Solution) solutions;
    mapping(uint256 => bytes32) private submittedSolutions;

    event SubmittedSolution(address indexed owner, uint256 indexed tokenId);

    function submitSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input,
        address account,
        uint256 tokenId
    ) public {
        require(
            squareVerifier.verifyTx(a, b, c, input),
            "Submitted Solution could not be verified"
        );
        bytes32 solutionId = keccak256(abi.encodePacked(a, b, c, input));

        submittedSolutions[tokenId] = solutionId;
        solutions[solutionId].owner = account;
        solutions[solutionId].tokenId = tokenId;
        solutions[solutionId].inputs = input;

        emit SubmittedSolution(account, tokenId);
    }

    function mint(address to, uint256 tokenId) public returns (bool) {
        bytes32 solutionId = submittedSolutions[tokenId];
        require(
            solutionId != bytes32(0),
            "Submitted is not submitted for the TokenId."
        );
        require(
            !solutions[solutionId].minted,
            "Token Id submitted is already minted"
        );

        address owner = solutions[submittedSolutions[tokenId]].owner;
        require(owner == to, "Invalid Token Address Provided");

        solutions[solutionId].minted = true;
        return super.mint(to, tokenId);
    }
}
