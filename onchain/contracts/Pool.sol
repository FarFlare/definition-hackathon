pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DaoToken.sol";


contract Pool {
    address public owner;
    // For each `IERC721` and it's ID store the WEI amount deposited by user. 
    // {IERC721 => {IERC721_id => {sender => WEI}}}

    struct Holder {
        mapping(address => uint) shares;
        uint total;

        address[] participants;
        mapping(address => bool) participant_in_pool;

        IERC721 nft_address;
        uint nft_id;

        bool closed;
    }

    uint public pool_id;
    mapping(uint => Holder) pools;
//    mapping(IERC721 => mapping(uint => mapping(address => uint))) public pool;
//    mapping(IERC721 => mapping(uint => address[])) public pool_participants;

    // Store the total deposit amount for each `IERC721` token.
    mapping(IERC721 => mapping(uint => uint)) public pool_total;
    // Declare the events.
    event NewDeposit(IERC721 indexed nft_address, uint nft_id, address sender, uint deposit);
    event DistributionDaoToken(IERC721 indexed nft_address, uint nft_id, address sender);
    event TotalDaoToken(IERC721 indexed nft_address, uint nft_id, address sender);


    constructor(){
        owner = msg.sender;
    }

    function set_deposit(uint _pool_id) public payable {
        /*
        Receive the payment and update the pool statistics.
        */
        require(_pool_id <= pool_id, "This pools doesn't exist");
        require(pools[pool_id].closed == true, "This pool is closed");
        if (pools[pool_id].participant_in_pool[msg.sender] != true) {
            pools[pool_id].participants.push(msg.sender);
            pools[pool_id].participant_in_pool[msg.sender] = true;
        }
        pools[pool_id].shares[msg.sender] += msg.value;
        pools[pool_id].total += msg.value;
        emit NewDeposit(pools[pool_id].nft_address, pools[pool_id].nft_id, msg.sender, msg.value);
    }

    function get_absolute(uint _pool_id) public view returns (uint) {
        /*
        Get the absolute amount of WEI deposited by the specified user to the target `IERC721` token.
        */
        return pools[_pool_id].shares[msg.sender];
    }

    function get_total(uint _pool_id) public view returns(uint) {
        /*
        Get the total deposit sum for the target `IERC721` token.
        */
        return pools[_pool_id].total;
    }

    function distribute_dao_tokens(uint _pool_id, IERC20 _dao_token) public {
        require(pools[pool_id].closed == true, "This pool is closed");
        pools[_pool_id].closed = true;
        uint k = _dao_token.totalSupply() / pools[_pool_id].total;
        Holder storage pool = pools[_pool_id];
        for (uint i = 0; i < pools[_pool_id].participants.length; i++) {
            address recipient = pool.participants[i];
            _dao_token.transfer(recipient, pool.shares[recipient]*k);
        }
    }
}