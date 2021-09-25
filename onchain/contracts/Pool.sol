pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract Pool {
    address public owner;
    // For each NFT address and it's ID store the ETH amount for each user address. 
    // {NFT_address => {NFT_id => {sender_ID => ETH_amount}}}
    mapping(IERC721 => mapping(uint => mapping(address => uint)))) public pool;
    event NewDeposit(IERC721 indexed nft_address, uint nft_id, address owner, uint deposit);
    event NewClaim(IERC721 indexed nft_address, uint nft_id,  uint deposit);

    // ? clarify about class construction in solidity
    // is the class coustructed once or every transaction? (1 probably)
    constructor(){
        owner = msg.sender;
    }

    function set_deposit(IERC721 nft_address, uint nft_id) payable {
        /*
        */
        pool[nft_address][nft_id][msg.sender] += msg.value;
        emit NewDeposit(nft_address, nft_id, msg.sender, msg.value);
    }

    function get_amount(IERC721 nft_address, uint nft_id, address owner) internal view returns (uint) {
        /*
        */
        return pool[nft_address][nft_id][owner];
    }

    function claim(IERC721 nft_address, uint nft_id, IERC20 buyer_account) public view returns (bool){
        /*
        */
        uint sender_amount = pool[nft_address][nft_id][msg.sender];
        require(sender_amount == 0, "Claiming address is not a buyer.");

        // Count the proportion.
        
    }

}