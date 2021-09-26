const Pool = artifacts.require("Pool");
const Factory = artifacts.require("Factory");

module.exports = async function (deployer) {
  await deployer.deploy(Pool("0xF52B67C2241B0F7ab3b7643a0c78DAd0cB39a6A4"));
  await deployer.deploy(Factory, Pool.address);
  console.log("Pool:", (await Pool.deployed()).address);
  console.log("Factory:", (await Factory.deployed()).address);
};
