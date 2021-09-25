const Pool = artifacts.require("Pool");
const Factory = artifacts.require("Factory");

contract('Crowd', ([deployer, a, b, c]) => {
    let test = null

    before(async () => {
        pool = await Pool.new();
        factory = await Factory.new();
    })

    describe("Testing pool", async () => {
        it('Creates new party', async () => {
        })
    })
})