const Pool = artifacts.require("Pool");
const Factory = artifacts.require("Factory");
const Dao = artifacts.require("Dao");

module.exports = function (deployer) {
  pool = await deployer.deploy(Pool);
  console.log(pool)
  // deployer.deploy(Factory, );
  // deployer.deploy(Dao);
};
