const truffleAssert = require('truffle-assertions');

const Pool = artifacts.require("Pool");
const Factory = artifacts.require("Factory");
const Dao = artifacts.require("Dao");
const DaoToken = artifacts.require("DaoToken");

contract('Crowd', ([deployer, nft, a, b, c]) => {
    let test = null

    before(async () => {
        pool = await Pool.new();
        factory = await Factory.new(pool.address);
        dao = null;
        dao_token = null;
        party_name = "Crowd Protocol";
        ticker = "CRWD";
    })

    describe("Testing Pool", async () => {
        before(async () => {
            deposit_a = web3.utils.toWei("0.01", "ether")
            deposit_b = web3.utils.toWei("0.03", "ether")
        })
        it('Creates new party', async () => {
            tx = await pool.new_party(nft, 1, party_name, ticker);
            truffleAssert.eventEmitted(tx,
                'NewParty',
                (ev) => {return (ev.pool_id).toNumber() === 1}
            )
        })
        it('Add assets to pool', async () => {
            // user a
            await pool.set_deposit(1, {from: a, value: deposit_a});
            call = await pool.check_participant_in_pool(1, a);
            assert.equal(call, true);
            call = await pool.get_absolute(1, a);
            assert.equal(call, deposit_a)
            // user b
            await pool.set_deposit(1, {from: b, value: deposit_b});
            call = await pool.check_participant_in_pool(1, b);
            assert.equal(call, true);
            call = await pool.get_absolute(1, b);
            assert.equal(call, deposit_b);
        })
        it('Check pool total', async () => {
            call = await pool.get_total(1);
            assert.equal(call, web3.utils.toWei("0.04", "ether"));  // ToDo remove hardcode
        })
    })

    describe("Testing Factory", async () => {
        before(async () => {
            emission_amount = web3.utils.toWei("100", "ether")
        })
        it('Creates new Dao and emission', async () => {
            dao_at = null
            dao_token_at = null
            tx = await factory.new_dao(100, 1);
            truffleAssert.eventEmitted(tx,
                'NewDao',
                (ev) => {
                    console.log(`\tNew DAO at ${ev.dao}`)
                    console.log(`\tDAO Token at ${ev.dao_token}`)
                    dao_at = ev.dao;
                    dao_token_at = ev.dao_token
                    return (ev.name).toString() === party_name;
                }
            )
            dao = await Dao.at(dao_at);
            dao_token = await DaoToken.at(dao_token_at);
        })
        it('Checks DAO Tokens supply', async () => {
            call = await dao_token.totalSupply();
            assert.equal(call, emission_amount);
        })
        it('Checks DAO Tokens are transferred to Pool', async () => {
            call = await dao_token.balanceOf(a);
            assert.equal(call, web3.utils.toWei("25", "ether"));
            call = await dao_token.balanceOf(b);
            assert.equal(call, web3.utils.toWei("75", "ether"));
        })
    })
})