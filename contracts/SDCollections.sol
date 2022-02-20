//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SDCollections is ERC721URIStorage{ 

    using Counters for Counters.Counter;
    Counters.Counter private tokenCount;

    address owner;
    address newOwner;
    string tokenURL;

    uint public constant MAX_CAP = 200;

    event OwnershipTransferred(address);
    event OwnershipClaimed(address);
    event Minted(uint, address);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can invoke this function");
        _;
    }

    constructor(string memory _tokenURI) ERC721("Spacekayak", "KAYAK") {
        tokenURL = _tokenURI;
        owner = msg.sender;
    }

    function grantOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be a zero address");
        newOwner = _newOwner;
        emit OwnershipTransferred(newOwner);
    }

    function claimOwnerShip() external {
        require(msg.sender == newOwner, "Only new owner can call this function");
        owner = msg.sender;

        emit OwnershipClaimed(msg.sender);

    } 
    
    function mintNFTs(address[] memory to) external onlyOwner{
        
        require(bytes(tokenURL).length != 0, "Token URI cannot be null");

        for(uint i =0; i < to.length; i++){
            require(MAX_CAP >= tokenCount.current(), "Cannot mint more than 200 tokens");
          
            tokenCount.increment();
            uint tokenId = tokenCount.current();

            _safeMint(to[i], tokenId);
            _setTokenURI(tokenId, tokenURL);

            emit Minted(tokenId, to[i]);

        }       
    }
    
}
