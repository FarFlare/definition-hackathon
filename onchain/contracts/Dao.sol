pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Pool.sol";

contract Dao is IERC721Receiver {

    IERC20 public dao_token;
    string public name;
    uint public proposal_id;

    enum proposal_status{ ACTIVE, PASSED, FAILED }

    struct Asset {
        address addr;  // Address of stored asset
        uint id;  // Should be zero for ERC20 and non-zero for ERC721
    }

    struct Vault {
        mapping(address => mapping(uint => bool)) asset_locked;
        Asset[] erc721;  // Locked NFTs
        Asset[] erc20;  // Locked ERC20
    }

    struct Proposal {
        proposal_status status;
        string title;
        string description;
        bytes tx;  // Transaction to be executed when proposal passes.
        Asset asset;
        uint votes_for;  // Amount of "For" votes
        uint votes_against;  // Amount of "Against" votes
        uint threshold;  // Amount of voting power which took a part in voting process for the proposal to be closed
    }

    Vault vault;
    Pool pool_contract;
    mapping(uint => Proposal) proposals;  // Sale proposals by their ids
    // Store whether the user has voted or not.
    mapping(uint => mapping(address => bool)) vote_tracker; 
    mapping(address => uint) stakes;  // Staked voting power: user => amount. DEPRECATED

    constructor(string memory _name,
                IERC20 _dao_token,
                Pool _pool) {
        name = _name;
        dao_token = _dao_token;
        pool_contract = _pool;
    }

    function stake(uint _amount, address stake_for) public {
        if (dao_token.allowance(stake_for, address(this)) < _amount) {
            dao_token.approve(address(this), _amount);
        }
        dao_token.transferFrom(msg.sender, address(this), _amount);
        stakes[stake_for] += _amount;
    }

    function auto_stake(uint _amount, address _stake_for) public {
        dao_token.transferFrom(address(pool_contract), address(this), _amount);
        stakes[_stake_for] += _amount;
    }

    function get_stake(address _user) public view returns (uint){
        return stakes[_user];
    }

    function claim(uint _amount) public {  // 50
        uint user_stake = stakes[msg.sender];  // 2
        if (user_stake < _amount) {  // 2*50 < 50
            dao_token.transfer(msg.sender, user_stake);
        } else {
            dao_token.transfer(msg.sender, _amount);
            }
        
    }

    function propose_tx(string memory _title, string memory _description, bytes memory _tx_to_execute) public {
        require(stakes[msg.sender] != 0, "Please stake your governance tokens to create a new proposal");
        proposal_id += 1;
        Proposal memory proposal = Proposal(proposal_status.ACTIVE,
                                            _title,
                                            _description,
                                            _tx_to_execute,
                                            Asset(address(0x0), 0),
                                            0, 0,
                                            (3*dao_token.totalSupply())/4);
        proposals[proposal_id] = proposal;
    }

    function propose_sell(string memory _title, string memory _description, IERC721 _asset_address, uint _asset_id) public {
        proposal_id += 1;
        bytes memory empty;
        Asset memory asset = Asset(address(_asset_address), _asset_id);
        Proposal memory proposal = Proposal(proposal_status.ACTIVE,
                                    _title,
                                    _description,
                                    empty,
                                    asset,
                                    0, 0,
                                    (3*dao_token.totalSupply())/4);

        proposals[proposal_id] = proposal;
    }

    function get_proposal(uint _proposal_id) public view returns (Proposal memory) {
        return proposals[_proposal_id];
    }

    function vote(uint _proposal_id, bool _vote) public {  // vote: true - "For", false - "Against"
        require(stakes[msg.sender] != 0, "Please stake your governance tokens to vote");
        require(vote_tracker[_proposal_id][msg.sender] == true, "This user has already voted");
        if (_vote == true) {
            proposals[_proposal_id].votes_for += stakes[msg.sender];
        } else {
            proposals[_proposal_id].votes_against += stakes[msg.sender];
        }
        uint total_votes = proposals[_proposal_id].votes_for + proposals[_proposal_id].votes_against;
        // Mark that the user has voted for this proposal.
        vote_tracker[_proposal_id][msg.sender] = true;
        if (total_votes >= proposals[_proposal_id].threshold) {
            outcome(_proposal_id);
        }
    }

    function votes_distribution(uint _proposal_id) public view returns (uint[2] memory){
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
            require(asset.ownerOf(_asset_id) == address(this), "This asset isn't locked");
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
