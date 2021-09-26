const truffleAssert = require('truffle-assertions');

const Pool = artifacts.require("Pool");
const Factory = artifacts.require("Factory");
const Dao = artifacts.require("Dao");
const DaoToken = artifacts.require("DaoToken");
const MockNft = artifacts.require("MockNft");

contract('Crowd', ([deployer, initiator, a, b, c]) => {
    let test = null

    before(async () => {
        pool = await Pool.new();
        factory = await Factory.new(pool.address);
        mock_nft = await MockNft.new();
        dao = null;
        dao_token = null;

        party_name = "Crowd Protocol";
        ticker = "CRWD";
    })

    describe("Testing Pool", async () => {
        before(async () => {
            deposit_a = web3.utils.toWei("0.03", "ether")
            deposit_b = web3.utils.toWei("0.03", "ether")
            deposit_c = web3.utils.toWei("0.04", "ether")
        })
        it('Creates new party', async () => {
            tx = await pool.new_party(mock_nft.address, 1, party_name, ticker);
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
            // user c
            await pool.set_deposit(1, {from: c, value: deposit_c});
            call = await pool.check_participant_in_pool(1, c);
            assert.equal(call, true);
            call = await pool.get_absolute(1, c);
            assert.equal(call, deposit_c);
        })
        it('Check pool total', async () => {
            call = await pool.get_total(1);
            assert.equal(call, web3.utils.toWei("0.1", "ether"));  // ToDo remove hardcode
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
        it('Get DAO by Pool', async () => {
            call = await factory.get_dao(1);
            assert.equal(call, dao.address);
        })
        it('Checks DAO Tokens supply', async () => {
            call = await dao_token.totalSupply();
            assert.equal(call, emission_amount);
        })
        it('Checks DAO Tokens are transferred to Stake', async () => {
            call = await dao.get_stake(a);
            assert.equal(call.toString(), web3.utils.toWei("30", "ether"));
            call = await dao.get_stake(b);
            assert.equal(call, web3.utils.toWei("30", "ether"));
            call = await dao.get_stake(c);
            assert.equal(call, web3.utils.toWei("40", "ether"));
        })
    })

    describe("Testing Dao", async () => {
        it('Awarding Mock NFT to initiator', async () => {
            tx = await mock_nft.awardItem(initiator, "https://www.tynker.com/minecraft/editor/item/bow/5aa6f77094e01dd76d8b4567?image=true");
            truffleAssert.eventEmitted(tx,
                                       'Transfer',
                                       (ev) => {return ev.tokenId.toNumber() === 1}
            )
        })
        it('Transferring an NFT to Dao and register it', async () => {
            await mock_nft.safeTransferFrom(initiator, dao.address, 1, {from: initiator})
            call = await mock_nft.ownerOf(1);
            assert.equal(call, dao.address);
            await dao.add_asset(mock_nft.address, 1);
        })
        it('New sell proposal', async () => {
            await dao.propose_sell("Let's sell?", "It's a good time while hype", mock_nft.address, 1);
            call = (await dao.proposal_id()).toNumber();
            assert.equal(call, 1);
            proposal = await dao.get_proposal(1);
            assert.equal(proposal.status, 0);
            assert.equal(proposal.title.toString(), "Let's sell?");
        })
        it('Vote for proposal', async () => {
            await dao.vote(1, true, {from: a});
            call = await dao.votes_distribution(1);
            assert.equal(call.toString(), "30000000000000000000,0");
            await dao.vote(1, true, {from: b});
            call = await dao.votes_distribution(1);
            assert.equal(call.toString(), "60000000000000000000,0");
            await dao.vote(1, false, {from: c});
            call = await dao.votes_distribution(1);
            assert.equal(call.toString(), "60000000000000000000,40000000000000000000");
            proposal = await dao.get_proposal(1);
            assert.equal(proposal.status, 1);
        })
    })
})