pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract Pool {
    address public senderAddress;

    function distribute_shares(IERC721 nft_address, uint nft_id, ERC20Votes shares) internal {}

}