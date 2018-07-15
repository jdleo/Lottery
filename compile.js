//bring in path and fs so that we can read .sol file
const path = require('path');
const fs = require('fs');

//bring in solidity compiler
const solc = require('solc');

//generate path to point to lottery.sol contract file
const lotteryPath = path.resolve(__dirname, 'contracts', 'lottery.sol');

//read .sol source
const source = fs.readFileSync(lotteryPath, 'utf8');

//compile and export contract object
module.exports = solc.compile(source, 1).contracts[':Lottery'];
