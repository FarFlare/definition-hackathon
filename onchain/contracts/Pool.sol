pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DaoToken.sol";


contract Pool {
    address public owner;
    
    struct Party {
        /*
        Contains the properties of the target IERC721 token.
        */
        // Store the account address.
        IERC721 nft_address;
        // Store the ID of the token.
        uint nft_id;
        // Store the total deposited sum.
        uint total;
        // Track whether the acquisition process is already closed.
        bool closed;
        // Store the array of all unique participanting addresses.
        address[] participants;
    }

    uint public pool_id;
    // Map pool_id => user address => absolute deposit amount.
    mapping(uint => mapping(address => uint)) shares; 
    // Store whether the user participates the specific pool. 
    // pool_id => user address => bool is participant.
    mapping(uint => mapping(address => bool)) participant_in_pool;
    mapping(uint => Party) pools;
    // Map target IERC721 address and ID to the pool ID.
    mapping(IERC721 => mapping(uint => uint)) pool_id_by_nft;

    // Declare the events.
    event NewDeposit(IERC721 indexed nft_address, uint nft_id, address sender, uint deposit);
    event DistributionDaoToken(IERC721 indexed nft_address, uint nft_id, address sender);
    event TotalDaoToken(IERC721 indexed nft_address, uint nft_id, address sender);


    constructor(){
        owner = msg.sender;
    }

    function new_party(IERC721 _nft_address, uint _nft_id) public returns (uint) {
        if (pool_id_by_nft[_nft_address][_nft_id] == 0) {
            return pool_id_by_nft[_nft_address][_nft_id];
        }
        pool_id += 1;
        address[] memory empty;
        Party memory party = Party(_nft_address, _nft_id, 0, false, empty);
        pools[pool_id] = party;
        return pool_id;
    }

    function set_deposit(uint _pool_id) public payable {
        /*
        Receive the payment and update the pool statistics.
        */
        require(_pool_id <= pool_id, "This pools doesn't exist");
        require(pools[pool_id].closed == true, "This pool is closed");
        if (participant_in_pool[pool_id][msg.sender] != true) {
            pools[pool_id].participants.push(msg.sender);
            participant_in_pool[pool_id][msg.sender] = true;
        }
        shares[_pool_id][msg.sender] += msg.value;
        pools[pool_id].total += msg.value;  
        emit NewDeposit(pools[pool_id].nft_address, pools[pool_id].nft_id, msg.sender, msg.value);
    }

    function get_absolute(uint _pool_id) public view returns (uint) {
        /*
        Get the absolute amount of WEI deposited by the specified user to the target `IERC721` token.
        */
        return shares[_pool_id][msg.sender];
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
        Party storage pool = pools[_pool_id];
        for (uint i = 0; i < pools[_pool_id].participants.length; i++) {
            address recipient = pool.participants[i];
            _dao_token.transfer(recipient, shares[_pool_id][recipient]*k);
        }
    }
}