const Pool = artifacts.require("Pool");
const Factory = artifacts.require("Factory");

module.exports = async function (deployer) {
  await deployer.deploy(Pool);
  await deployer.deploy(Factory, Pool.address);
  console.log("Pool:", (await Pool.deployed()).address);
  console.log("Factory:", (await Factory.deployed()).address);
};
