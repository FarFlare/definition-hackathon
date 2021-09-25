pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Dao is IERC721Receiver {

    IERC20 public dao_token;
    string public name;
    uint public proposal_id;

    enum proposal_status{ ACTIVE, PASSED, FAILED }

    struct Proposal {
        proposal_status status;
        string title;
        string description;
        bytes tx;  // Transaction to be executed when proposal passes
        uint votes_for;  // Amount of "For" votes
        uint votes_against;  // Amount of "Against" votes
        uint threshold;  // Amount of voting power which took a part in voting process for the proposal to be closed
    }

    struct Asset {
        address addr;  // Address of stored asset
        uint id;  // Should be zero for ERC20 and non-zero for ERC721
    }

    struct Vault {
        mapping(address => mapping(uint => bool)) asset_locked;
        Asset[] erc721;  // Locked NFTs
        Asset[] erc20;  // Locked ERC20
    }

    Vault vault;
    mapping(uint => Proposal) proposals;  // All proposals by their ids
    mapping(address => uint) stakes;  // Staked voting power: user => amount

    constructor(string memory _name,
                IERC20 _dao_token) {
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

    function claim(uint _amount) public {  // 50
        uint user_stake = stakes[msg.sender];  // 2
        if (user_stake < _amount) {  // 2*50 < 50
            dao_token.transfer(msg.sender, user_stake);
        } else {
            if (user_stake < _amount) {
                dao_token.transfer(msg.sender, user_stake);
            } else {
                dao_token.transfer(msg.sender, _amount);
            }
        }
    }

    function propose(string memory _title, string memory _description, bytes memory _tx_to_execute) public {
        require(dao_token.balanceOf(msg.sender) != 0, "Please stake your governance tokens to create a new proposal");
        proposal_id += 1;
        Proposal memory proposal = Proposal(proposal_status.ACTIVE,
                                            _title,
                                            _description,
                                            _tx_to_execute,
                                            0, 0,
                                            (3*dao_token.totalSupply())/4);
        proposals[proposal_id] = proposal;
    }

    function vote(uint _proposal_id, bool _vote) public {  // vote: true - "For", false - "Against"
        require(dao_token.balanceOf(msg.sender) != 0, "Please stake your governance tokens to vote");
        if (_vote == true) {
            proposals[_proposal_id].votes_for += stakes[msg.sender];
        } else {
            proposals[_proposal_id].votes_against += stakes[msg.sender];
        }
        uint total_votes = proposals[_proposal_id].votes_for + proposals[_proposal_id].votes_against;
        if (total_votes >= proposals[_proposal_id].threshold) {
            outcome(_proposal_id);
        }
    }

    function votes_distribution(uint _proposal_id) public returning (uint[]){
        return [proposals[_proposal_id].votes_for, proposals[_proposal_id].votes_against];
    }

    function outcome(uint _proposal_id) internal {
        if (proposals[_proposal_id].votes_for > proposals[_proposal_id].votes_against) {
            proposals[_proposal_id].status = proposal_status.PASSED;
        } else {
        proposals[_proposal_id].status = proposal_status.FAILED;
        }
    }

    function add_asset(address _asset_address, uint _asset_id) public {  // Check struct Asset for details
        require(vault.asset_locked[_asset_address][_asset_id] == false, "This asset is already locked");
        if (_asset_id != 0) {  // NFT
            IERC721 asset = IERC721(_asset_address);
            require(asset.ownerOf(_asset_id) != address(this), "This asset isn't locked");
            vault.erc721.push(Asset(_asset_address, _asset_id));
        } else {  // ERC20
            vault.erc20.push(Asset(_asset_address, _asset_id));
        }
        vault.asset_locked[_asset_address][_asset_id] = true;
    }

    function get_asset(uint _asset_type) public view returns(Asset[] memory) {
        /*
        Get locked assets. UI should iterate over them checking the owner is this DAO
        _asset_type: 0 - "erc721" / 1 - "erc20"
        */
        if (_asset_type == 0) {
            return vault.erc721;
        } else {
            if (_asset_type == 1) {
                return vault.erc20;
            }
        }
        Asset[] memory empty;
        return empty;
    }

    function onERC721Received(address operator,
                              address from,
                              uint256 tokenId,
                              bytes calldata data) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

}
