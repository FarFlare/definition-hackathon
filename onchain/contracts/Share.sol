pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Share {
    constructor(string memory _name, string memory _symbol, uint _amount) ERC20(_name, _symbol) {
        _mint(msg.sender, _amount * 10 ** decimals());
    }
}
