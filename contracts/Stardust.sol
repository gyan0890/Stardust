// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity ^0.8.0;

contract Stardust {
    uint256 maxFractions;
    address owner;
    struct Collection {
        address collectionAddr;
        uint256 totalNft;
        uint256 numNft;
        uint256 fractions;
    }

    mapping(address => address) fractionContractMapping;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }
        
    event Launch(address indexed, address indexed);

    constructor(uint256 _maxFractions) {
         maxFractions = _maxFractions;
         owner = msg.sender;
    }

    function addCollection(address collectionAddress, string memory tokenName, string memory tokenSymbol, uint256 _totalNft) public onlyOwner returns(bool) {
        require(collectionAddress != address(0), "Collection address is not valid");
        Collection memory collection = Collection(collectionAddress,_totalNft, 0, 0);

        uint256 numberOfTokens = _totalNft*maxFractions;
        FractionaliseStardust fractions = new FractionaliseStardust(tokenName, tokenSymbol, numberOfTokens);

        fractionContractMapping[collectionAddress] = address(fractions);

        return true;

    }

    function depositNftPool(address collectionAddress, uint256 tokenId) public returns(address) {
        ERC721 nftAddress = ERC721(collectionAddress);
        require(fractionContractMapping[collectionAddress] != address(0), "Collection is not registered");
        require(msg.sender == nftAddress.ownerOf(tokenId), "Caller is not the owner.");

        //Transferring the NFT into the contract - need an approval call before this
        nftAddress.safeTransferFrom(msg.sender, address(this), tokenId);

        FractionaliseStardust fractionalTokens =  FractionaliseStardust(fractionContractMapping[collectionAddress]);

        fractionalTokens.mintToken(maxFractions, msg.sender);

        return address(fractionalTokens);

    }

    //Returns the DAO contract addresses for a particular owner
    function getContract(address _collection) external view returns(address) {
        return(fractionContractMapping[_collection]);
    }

}

/**
 * @title DAOLaunch Token
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/examples/SimpleToken.sol
 */
contract FractionaliseStardust is ERC20 {
    
    address owner;
    uint256 maxSupply;
    bool active;

    event Mint(address indexed, uint256 indexed);

    constructor(string memory _name, string memory _symbol, uint256 _maxSupply) ERC20(_name, _symbol) {
      maxSupply = _maxSupply;
      active = true;
    }

    //Mint the tokens for the NFT
    function mintToken(uint256 numTokens, address to) public {
        require(maxSupply > 0, "Maximum Token Supply cannot be 0");
        require(owner != address(0), "Owner cannot be 0 address");
        require(tx.origin == to, "Origin is not owner");

        _mint(to, numTokens);
        emit Mint(to, numTokens);

    }

}
