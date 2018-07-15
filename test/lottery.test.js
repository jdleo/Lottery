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
});
