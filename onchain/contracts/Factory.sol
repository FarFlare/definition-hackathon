pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./Pool.sol";
import "./Share.sol";
import "./Dao.sol";

contract Factory {

    address public initiator;  // Offchain initiator
    Pool public pool;
    address public owner;  // Will allow to setup offchain initiator

    modifier ownerOnly {require(msg.sender == owner); _;}
    modifier initiatorOnly {require(msg.sender == owner); _;}

    constructor() {
        owner = msg.sender;
        initiator = msg.sender;
    }

    function setup(address _new_initiator, Pool _new_pool) public ownerOnly {
        if (_new_initiator != address(0x0)) {
            initiator = _new_initiator;
        }
        if (address(_new_pool) != address(0x0)) {
            pool = _new_pool;
        }
    }

    function new_dao(IERC721 nft_address, uint nft_id, uint _shares_amount) public initiatorOnly {
        //  Setting up the emission
        ERC20Votes dao_token = new Share("Crowd Shares", "CS", _shares_amount);
        //  Building the brand new DAO
        Dao dao = new Dao("name", dao_token);

        //  Sending tokens to Pool for distribution
        dao_token.transfer(address(pool), dao_token.totalSupply());
        pool.distribute_shares(nft_address, nft_id, dao_token);
    }

}
