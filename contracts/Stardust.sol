// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity ^0.8.0;

contract Stardust {

    struct Collection {
        address collectionAddr;
        uint256 totalNft;
        uint256 numNft;
        uint256 fractions;
    }

    mapping(address => address) fractionContractMapping;
        
    event Launch(address indexed, address indexed);

    constructor() {
         
    }

    function addCollection(address collectionAddress, string memory tokenName, string memory tokenSymbol, uint256 _totalNft) public onlyOwner returns(bool) {
        require(collectionAddress != address(0), "Collection address is not valid");
        Collection collection = new Collection(collectionAddress,_totalNft, 0, 0);




    }

    function deploy(string memory name, string memory symbol, string memory description, uint256 totalSupply) external returns (address) {
        uint256 tokenSupply = totalSupply*(1 ether);
        DAOLaunch dao = new DAOLaunch(name, symbol, description, tokenSupply, msg.sender);
        Contracts.push();

        uint Index = Contracts.length - 1;
        Contracts[Index].owner = msg.sender;
        Contracts[Index].id = Index;
        Contracts[Index].contractAddress = address(dao);


        addressContractMap[msg.sender].push(address(dao));

        emit Launch(address(dao), msg.sender);

        return address(dao);
    }

    //Returns the DAO contract addresses for a particular owner
    function getContract() external view returns(address[] memory) {
        return(addressContractMap[msg.sender]);
    }

    //Get all the contract addresses of the various DAOs
    function getAllContracts() external view returns(_contract[] memory) {
        return Contracts;
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


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint256 _maxSupply) ERC20(_name, _symbol) {
      maxSupply = _maxSupply;
      active = true;
    }

    //Mint the tokens for a DAO - possible only once
    function mintToken(uint256 numTokens) public onlyOwner {
        require(maxSupply > 0, "Maximum Token Supply cannot be 0");
        require(owner != address(0), "Owner cannot be 0 address");
        require(!mintState, "Tokens have already been minted");

        _mint(owner, numTokens);
        mintState = true;
        emit Mint(msg.sender, maxSupply);

    } 

    function deactivate() public onlyOwner() {
        active = false;
    }

    
    //Return the metadata of a DAO
    function getMetadata() external view returns(string memory, string memory, string memory, uint256, bool) {
        return (daoName, daoSymbol, description, maxSupply, active);
    }

}
