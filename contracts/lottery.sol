pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    /*
     * Constructor method on contract creation
     * Address of contract creator gets assigned as a 'manager'
     */
    function Lottery() public {
        //address of the contract creator becomes the lottery 'manager'
        manager = msg.sender;
    }

    /*
     * Method to enter address into lottery
     */
    function enter() public payable {
        //minimum amount sent must be at least 0.01 ETH
        require(msg.value > 0.01 ether);

        //enter this player's address into 'players' array
        players.push(msg.sender);
    }

    /*
     * Method to get list of entered players
     * @return address[] : array of player addresses
     */
    function getPlayers() public returns (address[]) {
        return players;
    }

    /*
     * Method to generate pseudorandom number
     * @return uint : the number that was generated
     */
    function random() public view returns (uint) {
        //hash block difficulty + timestamp + players array
        bytes32 hash = keccak256(block.difficulty, now, players);

        //digest hash to uint and return
        return uint(hash);
    }

    /*
     * Method to pick winner from list of players
     * Uses random() % players.length for selection
     * Sends entire contract balance to winning player
     */
    function pickWinner() public verifyManager {
        //get index by generating random number modulo player length
        uint index = random() % players.length;

        //transfer entire contract balance to winner
        players[index].transfer(this.balance);

        //clear players
        players = new address[](0);
    }

    /*
     * Modifier to verify that the account calling any method is the manager
     */
    modifier verifyManager() {
        //verify that the calling account is the manager
        require(msg.sender == manager);
        _;
    }
}
