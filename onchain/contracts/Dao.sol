pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dao {

    IERC20 public dao_token;
    string public name;
    uint public proposal_id;

    enum proposal_status{ ACTIVE, PASSED, FAILED }

    struct Proposal {
        proposal_status status;
        string title;
        string description;
        bytes tx;  // Transaction to be executed when proposal passes
        uint for_votes;  // Amount of "For" votes
        uint against_votes;  // Amount of "Against" votes
    }

    mapping(uint => Proposal) proposals;  // All proposals by their ids
    mapping(address => uint) stakes;  // Staked voting power: user => amount

    constructor(string memory _name, IERC20 _dao_token) {
        name = _name;
        dao_token = _dao_token;
    }

    function stake(uint _amount) public {
        if (dao_token.allowance(msg.sender, address(this)) < _amount) {
            dao_token.approve(address(this), _amount);
        }
        dao_token.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender] += _amount;
    }

    function claim(uint _amount) public {
        uint user_stake = stakes[msg.sender];
        if (user_stake > _amount) {
            dao_token.transfer(msg.sender, user_stake);
        } else {
        dao_token.transfer(msg.sender, _amount);
        }
    }

    function propose(string memory _title, string memory _description, bytes _tx_to_execute) {
        assert(dao_token.balanceOf(msg.sender) != 0, "You should stake your governance tokens to create a new proposal");
        proposal_id += 1;
        proposal = Proposal(proposal_status.ACTIVE,
                            _title,
                            _description,
                            _tx_to_execute,
                            0, 0);
    }

    function vote(uint _proposal_id, bool vote) {  // vote: true - "For", false - "Against"
        assert(dao_token.balanceOf(msg.sender) != 0, "Please stake your governance tokens to vote");

    }

}
