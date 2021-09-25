pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract Pool {
    address public owner;
    // For each NFT address and it's ID store the ETH amount for each user address. 
    // {NFT_address => {NFT_id => {sender_ID => ETH_amount}}}
    mapping(IERC721 => mapping(uint => mapping(address => uint))) public pool;
    mapping(IERC721 => mapping(uint => uint)) public pool_total;
    event NewDeposit(IERC721 indexed nft_address, uint nft_id, address sender, uint deposit);
    event DistributionShare(IERC721 indexed nft_address, uint nft_id, address sender);
    event TotalShare(IERC721 indexed nft_address, uint nft_id, address sender);


    constructor(){
        owner = msg.sender;
    }

    function set_deposit(IERC721 nft_address, uint nft_id) payable {
        /*
        */
        pool[nft_address][nft_id][msg.sender] += msg.value;
        emit NewDeposit(nft_address, nft_id, msg.sender, msg.value);
    }

    function get_amount(IERC721 nft_address, uint nft_id, address owner) public view returns (uint) {
        /*
        */
        return pool[nft_address][nft_id][owner];
    }

    function get_distribution(IERC721 nft_address, uint nft_id) public view returns(mapping(address => uint)){
        /*
        */
        emit DistributionShare(nft_address, nft_id, msg.sender);
        return pool[nft_address][nft_id];
    }

    function get_total(IERC721 nft_address, uint nft_id) public view returns(uint) {
        /*
        */
        emit TotalShare(nft_address, nft_id, msg.sender);
        return pool_total[nft_address][nft_id];
    }

    function get_stats(IERC721 nft_address, uint nft_id) public view returns (mapping(address => uint), uint) {
        /*
        */
        mapping(address => uint) distribution = get_distribution(nft_address, nft_id);
        uint total_sum = get_total(nft_address, nft_id);
        return (distribution, total_sum);

    }

}