pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Pool {
    address public senderAddress;

    function distribute_shares(IERC721 nft_address, uint nft_id, IERC20 shares);

}