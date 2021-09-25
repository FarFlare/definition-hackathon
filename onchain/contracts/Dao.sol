pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Pool.sol";

contract Dao is IERC721Receiver {

    IERC20 public dao_token;
    string public name;
    uint public proposal_id;
    Pool public pool;

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
    uint public k;  // If shares supply isn't equal the NFT price we should store multiplier for claim() and stake()

    constructor(string memory _name,
                IERC20 _dao_token,
                IERC721 _nft_address,
                uint _nft_id) {
        uint pool_amount;
        name = _name;
        dao_token = _dao_token;
        (pool_amount, stakes) = pool.get_stats(_nft_address, _nft_id);
        k = dao_token.totalSupply() / pool_amount;  // 100 / 2 = 50
    }

    function stake(uint _amount) public {
        if (dao_token.allowance(msg.sender, address(this)) < _amount) {
            dao_token.approve(address(this), _amount);
        }
        dao_token.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender] += _amount/k;
    }

    function claim(uint _amount) public {  // 50
        uint user_stake = stakes[msg.sender];  // 2
        if (user_stake*k < _amount) {  // 2*50 < 50
            dao_token.transfer(msg.sender, user_stake*k);
        } else {
            dao_token.transfer(msg.sender, _amount);  // 50
        }
    }

    function propose(string memory _title, string memory _description, bytes _tx_to_execute) {
        assert(dao_token.balanceOf(msg.sender) != 0, "Please stake your governance tokens to create a new proposal");
        proposal_id += 1;
        proposal = Proposal(proposal_status.ACTIVE,
                            _title,
                            _description,
                            _tx_to_execute,
                            0, 0,
                            (3*dao_token.totalSupply())/(4*k));
    }

    function vote(uint _proposal_id, bool vote) {  // vote: true - "For", false - "Against"
        assert(dao_token.balanceOf(msg.sender) != 0, "Please stake your governance tokens to vote");
        if (vote == true) {
            proposals[_proposal_id].votes_for += stakes[msg.sender];
        } else {
            proposals[_proposal_id].votes_against += stakes[msg.sender];
        }
        total_votes = proposals[_proposal_id].votes_for + proposals[_proposal_id].votes_against;
        if (total_votes >= proposals[_proposal_id].threshold) {
            outcome(_proposal_id);
        }
    }

    function outcome(uint _proposal_id) internal {
        if (proposals[_proposal_id].votes_for > proposals[_proposal_id].votes_against) {
            proposals[_proposal_id].status = PASSED;
        } else {
        proposals[_proposal_id].status = FAILED;
        }
    }

    function add_asset(address _asset_address, uint _asset_id) {  // Check struct Asset for details
        assert(vault.asset_locked[_asset_address][_asset_id] == false, "This ERC721 is already locked");
        if (_asset_id != 0) {  // NFT
            IERC721 asset = IERC721(_asset_address);
            vault.erc721.push(Asset(_asset_address, _asset_id));
        } else {
            IERC20 asset = IERC20(_asset_address);
            vault.erc20.push(Asset(_asset_address, _asset_id));
        }
        vault.asset_locked[_asset_address][_asset_id] = true;
    }

    function get_asset(string type) public view returning(Asset[]) {  // type: "erc20"/"erc721" Get locked assets. UI should iterate over them checking the owner
        if (type == "erc721") {
            return vault.erc721;
        } else {
            if (type == "erc20") {
                return vault.erc20;
            }
        }
    }

    function onERC721Received(address operator,
        address from,
        uint256 tokenId,
        bytes calldata data) public override returns (bytes4) {
        return this.onERC721Received.selector;
    }

}
