pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract Pool {
    address public owner;
    // For each `IERC721` and it's ID store the WEI amount deposited by user. 
    // {IERC721 => {IERC721_id => {sender => WEI}}}
    mapping(IERC721 => mapping(uint => mapping(address => uint))) public pool;
    // Store the total deposit amount for each `IERC721` token.
    mapping(IERC721 => mapping(uint => uint)) public pool_total;
    // Declare the events.
    event NewDeposit(IERC721 indexed nft_address, uint nft_id, address sender, uint deposit);
    event DistributionShare(IERC721 indexed nft_address, uint nft_id, address sender);
    event TotalShare(IERC721 indexed nft_address, uint nft_id, address sender);


    constructor(){
        owner = msg.sender;
    }

    function set_deposit(IERC721 nft_address, uint nft_id) payable {
        /*
        Receive the payment and update the pool statistics.
        */
        pool[nft_address][nft_id][msg.sender] += msg.value;
        pool_total[nft_address][nft_id] += msg.value;
        emit NewDeposit(nft_address, nft_id, msg.sender, msg.value);
    }

    function get_absolute(IERC721 nft_address, uint nft_id, address sender) public view returns (uint) {
        /*
        Get the absolute amount of WEI deposited by the specified user to the target `IERC721` token.
        */
        return pool[nft_address][nft_id][sender];
    }

    function get_distribution(IERC721 nft_address, uint nft_id) public view returns (mapping(address => uint)) {
        /*
        Get the user=>WEI mapping for the target `IERC721` token.
        */
        dist = pool[nft_address][nft_id];
        emit DistributionShare(nft_address, nft_id, msg.sender);
        return dist; 
    }

    function get_total(IERC721 nft_address, uint nft_id) public view returns(uint) {
        /*
        Get the total deposit sum for the target `IERC721` token.
        */
        total = pool_total[nft_address][nft_id];
        emit TotalShare(nft_address, nft_id, msg.sender);
        return total;
    }

    function get_stats(IERC721 nft_address, uint nft_id) public view returns (mapping(address => uint), uint) {
        /*
        Get distribution stats and total deposit for the `IERC721` by one call.
        */
        mapping(address => uint) distribution = get_distribution(nft_address, nft_id);
        uint total_sum = get_total(nft_address, nft_id);
        return (distribution, total_sum);
    }
}