pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Pool.sol";
import "./DaoToken.sol";
import "./Dao.sol";

contract Factory {

    address public initiator;  // Offchain initiator
    address public owner;  // Will allow to setup offchain initiator
    Pool public pool;

    modifier ownerOnly {require(msg.sender == owner); _;}
    modifier initiatorOnly {require(msg.sender == owner); _;}

    event NewDao(string name, address indexed dao, address indexed dao_token);

    constructor(Pool _pool) {
        owner = msg.sender;
        initiator = msg.sender;
        pool = _pool;
    }

    function setup(address _new_initiator) public ownerOnly {
        if (_new_initiator != address(0x0)) {
            initiator = _new_initiator;
        }
    }

    function new_dao(uint _shares_amount, uint _pool_id) public initiatorOnly {
        //  Setting up the emission
        (string memory party_name, string memory  ticker) = pool.get_pool_description(_pool_id);
        IERC20 dao_token = new DaoToken(party_name, ticker, _shares_amount, address(pool));
        //  Building the brand new DAO
        Dao dao = new Dao(party_name, dao_token);
        emit NewDao(party_name, address(dao), address(dao_token));
        //  Sending tokens to Dao for distribution
        pool.distribute_dao_tokens(_pool_id, dao_token);
    }

}
