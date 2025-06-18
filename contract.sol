// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Owned {
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
}

contract Message is Owned {
    string private myMessage;
    event updateMessageEvent(string myMessage);

    function setMessage(string memory _x) public onlyOwner {
        myMessage = _x;
        emit updateMessageEvent(myMessage);
    }

    function getMessage() public view returns (string memory) {
        return myMessage;
    }
}
