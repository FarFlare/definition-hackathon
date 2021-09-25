const Pool = artifacts.require("Pool");
const Factory = artifacts.require("Factory");

contract('Crowd', ([deployer, a, b, c]) => {
    let test = null

    before(async () => {
        pool = await Pool.new();
        factory = await Factory.new();
    })

    describe("Test", async () => {
        it('Division', async () => {
            await test.divide(web3.utils.toWei('100', 'ether'), 50);
            console.log((await test.res()).toString());
        })
    })
})