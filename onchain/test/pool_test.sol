pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Pool.sol";

contract TestPool {
  Pool _pool;

  function beforeEach() public {
    _pool = new Pool();
  }

  function test_new_party() {

  }

  function test_set_deposit() {
  }

  function test_get_total() {

  }

  function test_distribute_dao_tokens() {

  }
}