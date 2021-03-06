const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  //get usable accounts from test network
  accounts = await web3.eth.getAccounts();

  //attempt to deploy contract to test net from first account in list
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
  it('deploys contract successfully', () => {
    //if contract address exists, it's most likely contract was created
    assert.ok(lottery.options.address);
  });

  it('allows a single account to enter lottery', async () => {
    //attempt to enter from first test account
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    //get list of players
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    //check if first player is equal to first account
    assert.equal(accounts[0], players[0]);

    //check if players array is length of 1 (only one account entered)
    assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter lottery', async () => {
    //attempt to enter from accounts at indices [1,2,3]
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei('0.02', 'ether')
    });

    //get list of players
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    //check if players array is length of 3 (we entered 3 test accounts)
    assert.equal(3, players.length);
  });

  it('restricts accounts from sending less than 0.01 ETH', async () => {
    //attempt to enter from first test account with 0.0001 ETH
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.0001', 'ether')
      });
      assert(false);
    } catch (err) {
      //there should be an error (sending less than minimum ETH)
      assert(err);
    }
  });

  it('makes sure only manager can pick a winner', async () => {
    try {
      //pick winner from account2 (manager is account0)
      await lottery.methods.pickWinner().send({
        from: accounts[2]
      });
      assert(false);
    } catch (err) {
      //there should be an error (non-manager trying to pick winner)
      assert(err);
    }
  });

  it('allows players to enter, and one winner receives money', async () => {
    //enter lottery from account0 (should win since only player in lotto)
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    })

    const balanceBeforeWin = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({from: accounts[0]});
    const balanceAfterWin = await web3.eth.getBalance(accounts[0]);

    const difference = balanceAfterWin - balanceBeforeWin;

    //verify that difference is around 2 eth (lottery pot winnings)
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  });
});
