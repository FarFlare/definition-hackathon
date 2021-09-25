const Test = artifacts.require("Test")

contract('Test', ([deployer, a, b, c]) => {
    let test = null

    before(async () => {
        test = await Test.new();
    })

    describe("Test", async () => {
        it('Division', async () => {
            await test.divide(web3.utils.toWei('100', 'ether'), 50);
            console.log((await test.res()).toString());
        })
    })
})