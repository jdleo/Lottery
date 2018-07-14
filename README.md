# Lottery

A simple Ethereum lottery that lives as a smart contract (solidity)  

## Workflow  
1. A "manager" creates the lottery contract (lottery owner)  
2. Players can call enter on contract (enter lottery) (minimum 0.01 ETH)
3. Manager at any given time can initiate picking of winner  
4. Blockchain decides winner by hashing difficulty+time+players modulo player length  
5. Winner is given entire contract balance  

## Deploy  
```
npm run deploy
```  

## Tests  
```
npm run test
```
