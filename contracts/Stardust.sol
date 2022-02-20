// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

pragma solidity ^0.8.0;

contract Stardust is IERC721Receiver{
    uint256 maxFractions;
    address owner;

    struct Collection {
        address collectionAddr;
        uint256 totalNft;
        uint256 numNft;
        uint256 fractions;
    }

    Collection[] collections;
    mapping(address => bool) collectionSupported;
    mapping(address => address) fractionContractMapping;
    mapping(address => uint256[]) nftTokenIdMap;


    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }
        
    event Launch(address indexed, address indexed);

    //Initial number of fractions is 100
    constructor(uint256 _maxFractions) {
         maxFractions = _maxFractions;
         owner = msg.sender;
    }

      function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public pure override returns (bytes4) {
        return(bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")));
    }

    function addCollection(address collectionAddress, string memory tokenName, string memory tokenSymbol, uint256 _totalNft) public onlyOwner returns(bool) {
        require(collectionAddress != address(0), "Collection address is not valid");
        require(collectionSupported[collectionAddress] == false, "Collection already added");
        Collection memory collection = Collection(collectionAddress,_totalNft, 0, 0);

        collections.push(collection);

        uint256 numberOfTokens = _totalNft*maxFractions;
        FractionaliseStardust fractions = new FractionaliseStardust(tokenName, tokenSymbol, numberOfTokens);

        fractionContractMapping[collectionAddress] = address(fractions);
        collectionSupported[collectionAddress] = true;

        return true;

    }

    //Function to deposit the NFT into the contract and mint ERC-20s
    function depositNftPool(address collectionAddress, uint256 tokenId) public returns(address) {
        ERC721 nftAddress = ERC721(collectionAddress);
        require(fractionContractMapping[collectionAddress] != address(0), "Collection is not registered");
        require(msg.sender == nftAddress.ownerOf(tokenId), "Caller is not the owner.");

        //Transferring the NFT into the contract - need an approval call before this
        nftAddress.safeTransferFrom(msg.sender, address(this), tokenId);

        FractionaliseStardust fractionalTokens =  FractionaliseStardust(fractionContractMapping[collectionAddress]);
        nftTokenIdMap[msg.sender].push(tokenId);

        //Mint NFT tokens
        fractionalTokens.mintToken(maxFractions, msg.sender);

        return address(fractionalTokens);

    }

    //Internal function to transfer the GURU tokens
    function depositToken(address tokenAddr, address tokenOwner, uint256 amount) internal {
            uint256 amountToDeposit = amount * (1 ether);
            uint256 balance = FractionaliseStardust(tokenAddr).balanceOf(tokenOwner);
            require(balance >= amountToDeposit,"Balance is low");

            FractionaliseStardust(tokenAddr).transferFrom(tokenOwner, address(this),amountToDeposit);

    } 

    //Claim the original NFT back
    function claimNFT(address collectionAddress, uint256 tokenId) public returns(bool) {
        bool isOwner = false;
        address tokenAddress = fractionContractMapping[collectionAddress];
        for(uint256 i = 0; i < nftTokenIdMap[msg.sender].length; i++) {
            if(nftTokenIdMap[msg.sender][i] == tokenId) {
                isOwner = true;
                break;
            }
        }

        require(isOwner, "The caller does not own the NFT");
        depositToken(tokenAddress, msg.sender, maxFractions);

        ERC721(collectionAddress).safeTransferFrom(address(this), msg.sender, tokenId);

        //TODO: Burn the ERC-20 tokens generated
        //FractionaliseStardust(tokenAddress).burnToken(maxFractions);

        return true;

    }

    function getAllCollections() public view returns(Collection[] memory) {
        return collections;
    }

    //Returns the DAO contract addresses for a particular owner
    function getTokenContract(address _collection) external view returns(address) {
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
    event Burn(address indexed, uint256 indexed);

    constructor(string memory _name, string memory _symbol, uint256 _maxSupply) ERC20(_name, _symbol) {
      //The one who intiated the NFT transaction will be the owner here too
      owner = tx.origin;
      maxSupply = _maxSupply;
      active = true;
    }

    //Mint the tokens for a DAO - possible only once
    function mintToken(uint256 numTokens, address to) public {
        require(maxSupply > 0, "Maximum Token Supply cannot be 0");
        require(owner != address(0), "Owner cannot be 0 address");
        require(tx.origin == to, "Origin is not owner");

        uint256 tokensToMint = numTokens*(1 ether);
        _mint(to, tokensToMint);
        emit Mint(to, numTokens);

    }

    
    function burnToken(uint256 numTokens) external {
        //Check if the owner has the balance to burn
        require(balanceOf(msg.sender) >= numTokens, "Owner doesn't have the balance required to burn");
        //Burn the tokens
        transferFrom(msg.sender, address(0x000000000000000000000000000000000000dEaD),numTokens);
    }

}
